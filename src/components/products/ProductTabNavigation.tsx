import React, { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onCopyInfo?: () => void;
}

export const ProductTabNavigation: React.FC<ProductTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onCopyInfo
}) => {
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offset =
        buttonRect.left -
        containerRect.left +
        container.scrollLeft -
        container.clientWidth / 2 +
        buttonRect.width / 2;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const target = Math.min(Math.max(0, offset), Math.max(0, maxScroll));

      container.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    }
  }, [activeTab, tabs.length]);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div ref={containerRef} className="flex-1 overflow-x-auto">
              <nav className="flex space-x-1 py-4 min-w-max">
                {tabs.map(tab => (
                  <Button
                    key={tab.id}
                    ref={el => {
                      tabRefs.current[tab.id] = el;
                    }}
                    onClick={() => onTabChange(tab.id)}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-medium text-white shadow-sm'
                        : 'text-gray-600 hover:text-blue-medium hover:bg-blue-50'
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </nav>
            </div>
            
            {onCopyInfo && (
              <Button
                onClick={onCopyInfo}
                variant="outline"
                size="sm"
                className="border-blue-medium text-blue-medium hover:bg-blue-50 hover:text-blue-dark"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar informações
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};
