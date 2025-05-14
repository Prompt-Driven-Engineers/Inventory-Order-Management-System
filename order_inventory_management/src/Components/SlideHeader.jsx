import React, { useRef, useEffect, useState } from 'react';

const actualRoles = ['customer', 'seller', 'admin', 'warehouse'];
// Add extra elements before and after for circular illusion
const roles = [
  ...actualRoles.slice(-2), // ['admin', 'warehouse']
  ...actualRoles,           // ['customer', 'vendor', 'admin', 'warehouse']
  ...actualRoles.slice(0, 2), // ['customer', 'vendor']
];

export default function RoleSelector({ activeTab, setActiveTab }) {
  const containerRef = useRef(null);
  const tabRefs = useRef({});

  // Track real center index
  const centerIndex = roles.findIndex((r, i) => r === activeTab && i >= 2 && i <= 5);

  useEffect(() => {
    const selectedRef = tabRefs.current[centerIndex];
    if (selectedRef && containerRef.current) {
      selectedRef.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [centerIndex]);

  const handleClick = (index, role) => {
    setActiveTab(role);
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto flex no-scrollbar px-4 py-2 space-x-6"
    >
      {roles.map((role, index) => {
        const isActive = role === activeTab && index >= 2 && index <= 5;

        return (
          <button
            key={`${role}-${index}`}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleClick(index, role)}
            className={`transition-all duration-300 whitespace-nowrap ${
              isActive
                ? 'text-blue-500 text-xl font-bold scale-105'
                : 'text-gray-400 text-base scale-95'
            }`}
          >
            {role === 'customer' ? 'User Login' : `${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
          </button>
        );
      })}
    </div>
  );
}
