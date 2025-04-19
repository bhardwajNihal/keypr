'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import AddCardForm from '../cards/addCardForm';
import AddedCards from '../cards/cardsList';
import AddPasswordForm from '../passwords/addPwdForm';
import AddedPasswords from '../passwords/passwordsList';
import AddSecretForm from '../secretePhares/addSecreteForm';
import AddedSecrets from '../secretePhares/secretsList';

const tabs = ['Passwords', 'Cards', 'Secret Phrases'];

export default function VaultTabs() {

  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('Passwords');
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const activeBtn = containerRef.current.querySelector(
      `[data-tab="${activeTab}"]`
    ) as HTMLButtonElement;

    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full mt-2">
      <div
        className="relative flex border-b border-muted"
        ref={containerRef}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            data-tab={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'relative py-3 px-12 text-sm font-medium transition-colors',
              (activeTab === tab) ? (theme === "light") ? "text-black" : "text-white" : 'text-muted-foreground'
            )}
          >
            {tab}
          </button>
        ))}

        {/* Animated underline */}
        <span
          className="absolute bottom-0 h-[3px] bg-purple-700 transition-all duration-300 ease-in-out"
          style={{
            width: indicatorStyle.width,
            left: indicatorStyle.left,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6 border rounded-b-lg shadow-sm bg-background mt-2 mb-8 h-screen">
        {activeTab === 'Passwords' && (
          <div className='h-full w-full'>
            <h2>Add and view your saved site credentials here.</h2>
            <div className='flex gap-4 p-2 h-full w-full'>
              <AddPasswordForm />
              <AddedPasswords />
            </div>
          </div>
        )}
        {activeTab === 'Cards' && (
          <div className='h-full w-full'>
            <h2>Securely manage your credit/debit cards.</h2>
            <div className='flex gap-4 p-2 h-full w-full'>
              <AddCardForm />
              <AddedCards />
            </div>
          </div>
        )}
        {activeTab === 'Secret Phrases' && (
          <div className='h-full w-full'>
          <h2>Store your crypto wallet seed phrases safely.</h2>
          <div className='flex gap-4 p-2 h-full w-full'>
            <AddSecretForm />
            <AddedSecrets />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
