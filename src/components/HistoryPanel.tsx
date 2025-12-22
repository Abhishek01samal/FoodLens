import { memo, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MorphingCardStack, CardData } from '@/components/ui/morphing-card-stack';
import { History, Package, Utensils, Scale, Apple, Trash2 } from 'lucide-react';
import type { HistoryItem } from '@/hooks/useHistoryStore';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'comparison':
      return <Scale className="h-5 w-5" />;
    case 'product':
    case 'info':
      return <Package className="h-5 w-5" />;
    case 'food':
      return <Utensils className="h-5 w-5" />;
    case 'diet':
      return <Apple className="h-5 w-5" />;
    default:
      return <History className="h-5 w-5" />;
  }
};

const getModeColor = (mode: string) => {
  switch (mode) {
    case 'comparison':
      return 'hsl(var(--primary) / 0.1)';
    case 'product':
    case 'info':
      return 'hsl(280 70% 50% / 0.1)';
    case 'food':
      return 'hsl(150 70% 40% / 0.1)';
    case 'diet':
      return 'hsl(30 90% 50% / 0.1)';
    default:
      return undefined;
  }
};

export const HistoryPanel = memo(({ history, onSelectItem, onClearHistory }: HistoryPanelProps) => {
  const cards: CardData[] = useMemo(() => 
    history.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: getModeIcon(item.mode),
      color: getModeColor(item.mode),
      mode: item.mode,
      timestamp: item.timestamp,
      data: item.data,
    })),
  [history]);

  const handleCardClick = (card: CardData) => {
    const historyItem = history.find(h => h.id === card.id);
    if (historyItem) {
      onSelectItem(historyItem);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card shadow-lg"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
          {history.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem]">
              {history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[400px]">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Analysis History
            </SheetTitle>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="py-6">
          <MorphingCardStack
            cards={cards}
            defaultLayout="list"
            onCardClick={handleCardClick}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
});

HistoryPanel.displayName = 'HistoryPanel';
