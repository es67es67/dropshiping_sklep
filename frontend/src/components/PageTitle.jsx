import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title, description = '' }) => {
  const fullTitle = title ? `${title} - Portal` : 'Portal';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default PageTitle; 