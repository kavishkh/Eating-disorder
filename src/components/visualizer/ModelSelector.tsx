
import { Button } from '@/components/ui/button';

interface ModelSelectorProps {
  categories: string[];
  onSelect: (category: string) => void;
  isLoading: boolean;
}

export const ModelSelector = ({ categories, onSelect, isLoading }: ModelSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((category) => (
        <Button 
          key={category} 
          variant="outline"
          className="text-sm"
          onClick={() => onSelect(category)}
          disabled={isLoading}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
