import React from 'react';
import PropTypes from 'prop-types';

export const CalculatorTabs = ({ tabs, activeId, onChange }) => {
  return (
    <div className="calculator-tabs" role="tablist" aria-label="Calculator selection">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`calculator-tab${isActive ? ' calculator-tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span className="calculator-tab__label">{tab.label}</span>
            {tab.description ? (
              <span className="calculator-tab__description">{tab.description}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

CalculatorTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ),
  activeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

CalculatorTabs.defaultProps = {
  tabs: [],
};
