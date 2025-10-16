import React, { createContext, useContext, useState } from 'react';

const UserAccessContext = createContext();

export const useUserAccess = () => {
  const context = useContext(UserAccessContext);
  if (!context) {
    throw new Error('useUserAccess must be used within UserAccessProvider');
  }
  return context;
};

export const UserAccessProvider = ({ children }) => {
  // Default to web_customer for testing
  const [accessLevel, setAccessLevel] = useState('web_customer');
  
  // Access level configurations
  const accessLevels = {
    admin: {
      canAccessRetention: true,
      canModifyRolledDeferred: true,
      label: 'Administrator'
    },
    broker: {
      canAccessRetention: true,
      canModifyRolledDeferred: true,
      label: 'Broker'
    },
    web_customer: {
      canAccessRetention: false,
      canModifyRolledDeferred: false,
      label: 'Web Customer'
    }
  };

  const currentAccess = accessLevels[accessLevel] || accessLevels.web_customer;

  return (
    <UserAccessContext.Provider value={{
      accessLevel,
      setAccessLevel,
      canAccessRetention: currentAccess.canAccessRetention,
      canModifyRolledDeferred: currentAccess.canModifyRolledDeferred,
      accessLevelLabel: currentAccess.label,
      availableLevels: Object.keys(accessLevels)
    }}>
      {children}
    </UserAccessContext.Provider>
  );
};