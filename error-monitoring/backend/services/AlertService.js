const nodemailer = require('nodemailer');
const axios = require('axios');

// 🔴 CRITICAL SERVICE: Alert Service
// Zależności: nodemailer, axios
// Wpływ: Wszystkie alerty email/Slack/Discord
// Jeśli się zepsuje: brak powiadomień o błędach
// Używane w: ErrorService, ErrorHandler

class AlertService {
  constructor() {
    this.isInitialized = false;
    this.emailTransporter = null;
    this.alertConfig = {
      email: {
        enabled: process.env.SMTP_HOST ? true : false,
        recipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
        from: process.env.SMTP_FROM || 'noreply@portal.com'
      },
      slack: {
        enabled: !!process.env.SLACK_WEBHOOK_URL,
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_CHANNEL || '#alerts'
      },
      discord: {
        enabled: !!process.env.DISCORD_WEBHOOK_URL,
        webhookUrl: process.env.DISCORD_WEBHOOK_URL
      }
    };
  }

  // Inicjalizacja serwisu
  static async initialize() {
    try {
      console.log('🔄 Inicjalizacja AlertService...');
      
      // Konfiguracja email
      if (AlertService.alertConfig.email.enabled) {
        AlertService.emailTransporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        // Test połączenia
        await AlertService.emailTransporter.verify();
        console.log('✅ Połączenie email skonfigurowane');
      }

      AlertService.isInitialized = true;
      console.log('✅ AlertService zainicjalizowany');
      return true;
    } catch (error) {
      console.error('❌ Błąd inicjalizacji AlertService:', error);
      return false;
    }
  }

  // Wysyłanie alertu
  static async sendAlert(group, additionalData = {}) {
    try {
      console.log('🚨 Wysyłanie alertu dla grupy:', group.name);

      const alertData = {
        group: {
          id: group._id,
          name: group.name,
          message: group.message,
          severity: group.severity,
          errorType: group.errorType,
          totalOccurrences: group.totalOccurrences,
          uniqueUsers: group.uniqueUsers,
          affectedUrls: group.affectedUrls,
          firstSeen: group.firstSeen,
          lastSeen: group.lastSeen,
          trend: group.trend,
          status: group.status
        },
        ...additionalData
      };

      const promises = [];

      // Email alert
      if (AlertService.alertConfig.email.enabled && 
          AlertService.shouldSendEmailAlert(group)) {
        promises.push(AlertService.sendEmailAlert(alertData));
      }

      // Slack alert
      if (AlertService.alertConfig.slack.enabled && 
          AlertService.shouldSendSlackAlert(group)) {
        promises.push(AlertService.sendSlackAlert(alertData));
      }

      // Discord alert
      if (AlertService.alertConfig.discord.enabled && 
          AlertService.shouldSendDiscordAlert(group)) {
        promises.push(AlertService.sendDiscordAlert(alertData));
      }

      await Promise.allSettled(promises);
      console.log('✅ Alert wysłany');

    } catch (error) {
      console.error('💥 Błąd podczas wysyłania alertu:', error);
      throw error;
    }
  }

  // Wysyłanie alertu email
  static async sendEmailAlert(alertData) {
    try {
      if (!AlertService.emailTransporter) {
        throw new Error('Email transporter nie jest skonfigurowany');
      }

      const { group } = alertData;
      const severityColors = {
        critical: '#dc3545',
        high: '#fd7e14',
        medium: '#ffc107',
        low: '#28a745'
      };

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Alert - ${group.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { background: ${severityColors[group.severity]}; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
            .stat { background: white; padding: 15px; border-radius: 5px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: ${severityColors[group.severity]}; }
            .stat-label { font-size: 12px; color: #666; }
            .urls { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .url { background: #e9ecef; padding: 5px; margin: 2px 0; border-radius: 3px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 Alert - ${group.severity.toUpperCase()}</h1>
            <p><strong>${group.name}</strong></p>
          </div>
          
          <div class="content">
            <h2>Szczegóły błędu</h2>
            <p><strong>Wiadomość:</strong> ${group.message}</p>
            <p><strong>Typ:</strong> ${group.errorType}</p>
            <p><strong>Status:</strong> ${group.status}</p>
            <p><strong>Trend:</strong> ${group.trend}</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${group.totalOccurrences}</div>
                <div class="stat-label">Wystąpień</div>
              </div>
              <div class="stat">
                <div class="stat-value">${group.uniqueUsers}</div>
                <div class="stat-label">Użytkowników</div>
              </div>
              <div class="stat">
                <div class="stat-value">${group.affectedUrls.length}</div>
                <div class="stat-label">URL-i</div>
              </div>
              <div class="stat">
                <div class="stat-value">${Math.round((Date.now() - group.firstSeen.getTime()) / (1000 * 60 * 60 * 24))}d</div>
                <div class="stat-label">Wiek</div>
              </div>
            </div>
            
            <div class="urls">
              <h3>Dotknięte URL-e:</h3>
              ${group.affectedUrls.map(url => `<div class="url">${url}</div>`).join('')}
            </div>
            
            <p><strong>Pierwsze wystąpienie:</strong> ${group.firstSeen.toLocaleString('pl-PL')}</p>
            <p><strong>Ostatnie wystąpienie:</strong> ${group.lastSeen.toLocaleString('pl-PL')}</p>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: AlertService.alertConfig.email.from,
        to: AlertService.alertConfig.email.recipients.join(', '),
        subject: `[${group.severity.toUpperCase()}] Alert - ${group.name}`,
        html: emailHtml
      };

      await AlertService.emailTransporter.sendMail(mailOptions);
      console.log('📧 Email alert wysłany');

    } catch (error) {
      console.error('💥 Błąd podczas wysyłania email alertu:', error);
      throw error;
    }
  }

  // Wysyłanie alertu Slack
  static async sendSlackAlert(alertData) {
    try {
      const { group } = alertData;
      
      const severityEmoji = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢'
      };

      const slackMessage = {
        channel: AlertService.alertConfig.slack.channel,
        text: `${severityEmoji[group.severity]} *${group.severity.toUpperCase()} Alert*`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${severityEmoji[group.severity]} ${group.severity.toUpperCase()} Alert`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${group.name}*\n${group.message}`
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Wystąpień:*\n${group.totalOccurrences}`
              },
              {
                type: 'mrkdwn',
                text: `*Użytkowników:*\n${group.uniqueUsers}`
              },
              {
                type: 'mrkdwn',
                text: `*Status:*\n${group.status}`
              },
              {
                type: 'mrkdwn',
                text: `*Trend:*\n${group.trend}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*URL-e:*\n${group.affectedUrls.slice(0, 3).join('\n')}${group.affectedUrls.length > 3 ? '\n...' : ''}`
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Pierwsze wystąpienie: ${group.firstSeen.toLocaleString('pl-PL')}`
              }
            ]
          }
        ]
      };

      await axios.post(AlertService.alertConfig.slack.webhookUrl, slackMessage);
      console.log('💬 Slack alert wysłany');

    } catch (error) {
      console.error('💥 Błąd podczas wysyłania Slack alertu:', error);
      throw error;
    }
  }

  // Wysyłanie alertu Discord
  static async sendDiscordAlert(alertData) {
    try {
      const { group } = alertData;
      
      const severityColor = {
        critical: 0xdc3545,
        high: 0xfd7e14,
        medium: 0xffc107,
        low: 0x28a745
      };

      const discordMessage = {
        embeds: [
          {
            title: `${group.severity.toUpperCase()} Alert`,
            description: group.message,
            color: severityColor[group.severity],
            fields: [
              {
                name: 'Nazwa błędu',
                value: group.name,
                inline: true
              },
              {
                name: 'Typ',
                value: group.errorType,
                inline: true
              },
              {
                name: 'Status',
                value: group.status,
                inline: true
              },
              {
                name: 'Wystąpień',
                value: group.totalOccurrences.toString(),
                inline: true
              },
              {
                name: 'Użytkowników',
                value: group.uniqueUsers.toString(),
                inline: true
              },
              {
                name: 'Trend',
                value: group.trend,
                inline: true
              },
              {
                name: 'URL-e',
                value: group.affectedUrls.slice(0, 5).join('\n') + (group.affectedUrls.length > 5 ? '\n...' : ''),
                inline: false
              }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Portal Error Monitoring'
            }
          }
        ]
      };

      await axios.post(AlertService.alertConfig.discord.webhookUrl, discordMessage);
      console.log('🎮 Discord alert wysłany');

    } catch (error) {
      console.error('💥 Błąd podczas wysyłania Discord alertu:', error);
      throw error;
    }
  }

  // Sprawdzanie czy należy wysłać email alert
  static shouldSendEmailAlert(group) {
    return group.severity === 'critical' || 
           group.severity === 'high' ||
           (group.totalOccurrences > 10 && group.isRecent);
  }

  // Sprawdzanie czy należy wysłać Slack alert
  static shouldSendSlackAlert(group) {
    return group.severity === 'critical' || 
           group.severity === 'high' ||
           (group.totalOccurrences > 5 && group.isRecent);
  }

  // Sprawdzanie czy należy wysłać Discord alert
  static shouldSendDiscordAlert(group) {
    return group.severity === 'critical' || 
           group.severity === 'high' ||
           (group.totalOccurrences > 5 && group.isRecent);
  }

  // Wysyłanie testowego alertu
  static async sendTestAlert(type = 'email') {
    try {
      const testGroup = {
        _id: 'test-id',
        name: 'Test Alert',
        message: 'To jest testowy alert systemu monitorowania błędów',
        severity: 'medium',
        errorType: 'test',
        totalOccurrences: 1,
        uniqueUsers: 1,
        affectedUrls: ['http://localhost:3000/test'],
        firstSeen: new Date(),
        lastSeen: new Date(),
        status: 'new',
        trend: 'stable'
      };

      switch (type) {
        case 'email':
          await AlertService.sendEmailAlert({ group: testGroup });
          break;
        case 'slack':
          await AlertService.sendSlackAlert({ group: testGroup });
          break;
        case 'discord':
          await AlertService.sendDiscordAlert({ group: testGroup });
          break;
        default:
          await AlertService.sendAlert(testGroup);
      }

      console.log(`✅ Test alert (${type}) wysłany`);
    } catch (error) {
      console.error(`💥 Błąd podczas wysyłania test alertu (${type}):`, error);
      throw error;
    }
  }

  // Pobieranie konfiguracji alertów
  static getAlertConfig() {
    return {
      email: {
        enabled: AlertService.alertConfig.email.enabled,
        recipients: AlertService.alertConfig.email.recipients
      },
      slack: {
        enabled: AlertService.alertConfig.slack.enabled,
        channel: AlertService.alertConfig.slack.channel
      },
      discord: {
        enabled: AlertService.alertConfig.discord.enabled
      }
    };
  }
}

module.exports = AlertService; 