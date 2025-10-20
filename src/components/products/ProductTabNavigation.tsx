import React from 'react';
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

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between">
            <nav className="flex space-x-1 py-4">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-medium text-white shadow-sm'
                      : 'text-gray-600 hover:text-blue-medium hover:bg-blue-50'
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
            
            {onCopyInfo && (
              <Button
                onClick={onCopyInfo}
                variant="outline"
                size="sm"
                className="bg-green-success text-white border-green-success hover:bg-green-600"
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
