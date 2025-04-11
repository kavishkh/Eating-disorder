
import { useEffect, useRef } from 'react';

interface FoodModelProps {
  modelType: string | null;
  isLoading: boolean;
}

export const FoodModel = ({ modelType, isLoading }: FoodModelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !modelType || isLoading) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw the appropriate food model based on type
    switch (modelType) {
      case 'Proteins':
        drawProtein(ctx, centerX, centerY);
        break;
      case 'Carbohydrates':
        drawCarbs(ctx, centerX, centerY);
        break;
      case 'Vegetables':
        drawVegetable(ctx, centerX, centerY);
        break;
      case 'Fruits':
        drawFruit(ctx, centerX, centerY);
        break;
      case 'Dairy':
        drawDairy(ctx, centerX, centerY);
        break;
      case 'Fats':
        drawFats(ctx, centerX, centerY);
        break;
      case 'Balanced':
      default:
        drawPlate(ctx, centerX, centerY);
        break;
    }
  }, [modelType, isLoading]);
  
  // Helper function to get fill color based on food type
  const getFillColor = (foodType: string): string => {
    switch (foodType) {
      case 'Proteins': return '#F9A78D'; // Pinkish for meat
      case 'Carbohydrates': return '#F5DEB3'; // Wheat color
      case 'Vegetables': return '#90EE90'; // Light green
      case 'Fruits': return '#FF8C00'; // Orange
      case 'Dairy': return '#FFF8DC'; // Cream color
      case 'Fats': return '#FFD700'; // Gold for oils
      default: return '#FFFFFF';
    }
  };
  
  // Drawing helper functions
  const drawPlate = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw a simple plate
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();
    
    // Add a rim
    ctx.beginPath();
    ctx.arc(x, y, 120, 0, Math.PI * 2);
    ctx.stroke();
  };
  
  const drawProtein = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw a simple meat/protein shape
    ctx.fillStyle = getFillColor('Proteins');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(x, y, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add some texture lines
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 20);
    ctx.lineTo(x + 40, y - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 30, y);
    ctx.lineTo(x + 30, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 40, y + 20);
    ctx.lineTo(x + 40, y + 20);
    ctx.stroke();
  };
  
  const drawCarbs = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw bread shape
    ctx.fillStyle = getFillColor('Carbohydrates');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(x - 70, y - 40, 140, 80, 20);
    ctx.fill();
    ctx.stroke();
    
    // Add texture lines
    for (let i = -50; i <= 50; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - 30);
      ctx.lineTo(x + i, y + 30);
      ctx.stroke();
    }
  };
  
  const drawVegetable = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw broccoli-like shape
    ctx.fillStyle = getFillColor('Vegetables');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const baseX = x;
    const baseY = y + 30;
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX, baseY - 40);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#3CB043';
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    
    // Florets
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const flX = baseX + Math.cos(angle) * 40;
      const flY = (baseY - 60) + Math.sin(angle) * 20;
      
      ctx.beginPath();
      ctx.arc(flX, flY, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#90EE90';
      ctx.fill();
      ctx.stroke();
    }
    
    // Center floret
    ctx.beginPath();
    ctx.arc(baseX, baseY - 70, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#90EE90';
    ctx.fill();
    ctx.stroke();
  };
  
  const drawFruit = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw apple-like shape
    ctx.fillStyle = getFillColor('Fruits');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x, y - 65);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#654321';
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    
    // Leaf
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 60, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#228B22';
    ctx.fill();
    ctx.stroke();
  };
  
  const drawDairy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw milk carton
    ctx.fillStyle = getFillColor('Dairy');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(x - 40, y - 60, 80, 120, 5);
    ctx.fill();
    ctx.stroke();
    
    // Add carton details
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 50, 60, 30, 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 10, 60, 30, 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.roundRect(x - 30, y + 30, 60, 20, 2);
    ctx.stroke();
  };
  
  const drawFats = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw oil bottle
    ctx.fillStyle = getFillColor('Fats');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(x - 25, y - 10, 50, 70, 5);
    ctx.fill();
    ctx.stroke();
    
    // Bottle neck
    ctx.beginPath();
    ctx.roundRect(x - 15, y - 40, 30, 30, 5);
    ctx.fill();
    ctx.stroke();
    
    // Cap
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 55, 20, 15, 3);
    ctx.fillStyle = '#555';
    ctx.fill();
    ctx.stroke();
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width="600" 
      height="400" 
      className="rounded-lg w-full h-full"
    />
  );
};
