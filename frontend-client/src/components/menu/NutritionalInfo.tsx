import React from 'react';
import { cn } from '../../utils/cn';

export interface NutritionalData {
  calorias?: number;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  azucares?: number;
  fibra?: number;
  sodio?: number;
  colesterol?: number;
}

export interface NutritionalInfoProps {
  data: NutritionalData;
  className?: string;
  variant?: 'detailed' | 'compact' | 'badges' | 'chart';
  showPercentages?: boolean;
  referenceCalories?: number;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({
  data,
  className,
  variant = 'detailed',
  showPercentages = false,
  referenceCalories = 2000, // Dieta de referencia 2000 cal
}) => {
  // Calcular porcentajes basados en valores diarios recomendados
  const getPercentage = (value: number, dailyValue: number) => {
    return Math.round((value / dailyValue) * 100);
  };

  const dailyValues = {
    calorias: referenceCalories,
    proteinas: 50,
    carbohidratos: 300,
    grasas: 65,
    azucares: 50,
    fibra: 25,
    sodio: 2300,
    colesterol: 300,
  };

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return '--';
    return `${value}${unit}`;
  };

  const renderDetailedVariant = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
        Información Nutricional
      </h3>
      
      <div className="space-y-3">
        {/* Calorías - destacadas */}
        {data.calorias && (
          <div className="flex justify-between items-center py-2 border-b-2 border-gray-900">
            <span className="font-bold text-gray-900">Calorías</span>
            <div className="text-right">
              <span className="font-bold text-lg">{data.calorias}</span>
              {showPercentages && (
                <div className="text-xs text-gray-600">
                  {getPercentage(data.calorias, dailyValues.calorias)}% VD*
                </div>
              )}
            </div>
          </div>
        )}

        {/* Macronutrientes */}
        <div className="space-y-2">
          {data.grasas && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Grasas Totales</span>
              <div className="text-right">
                <span>{formatValue(data.grasas, 'g')}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-600 ml-2">
                    {getPercentage(data.grasas, dailyValues.grasas)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {data.colesterol && (
            <div className="flex justify-between items-center pl-4">
              <span className="text-gray-700">Colesterol</span>
              <div className="text-right">
                <span>{formatValue(data.colesterol, 'mg')}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-600 ml-2">
                    {getPercentage(data.colesterol, dailyValues.colesterol)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {data.sodio && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Sodio</span>
              <div className="text-right">
                <span>{formatValue(data.sodio, 'mg')}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-600 ml-2">
                    {getPercentage(data.sodio, dailyValues.sodio)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {data.carbohidratos && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Carbohidratos Totales</span>
              <div className="text-right">
                <span>{formatValue(data.carbohidratos, 'g')}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-600 ml-2">
                    {getPercentage(data.carbohidratos, dailyValues.carbohidratos)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {data.fibra && (
            <div className="flex justify-between items-center pl-4">
              <span className="text-gray-700">Fibra Dietética</span>
              <div className="text-right">
                <span>{formatValue(data.fibra, 'g')}</span>
                {showPercentages && (
                  <span className="text-xs text-gray-600 ml-2">
                    {getPercentage(data.fibra, dailyValues.fibra)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {data.azucares && (
            <div className="flex justify-between items-center pl-4">
              <span className="text-gray-700">Azúcares</span>
              <span>{formatValue(data.azucares, 'g')}</span>
            </div>
          )}

          {data.proteinas && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Proteínas</span>
              <span>{formatValue(data.proteinas, 'g')}</span>
            </div>
          )}
        </div>

        {showPercentages && (
          <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
            * El % del Valor Diario (VD) le indica la cantidad de un nutriente en una porción
            que contribuye a la dieta diaria. 2,000 calorías al día se usan para el consejo nutricional general.
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactVariant = () => (
    <div className="bg-gray-50 rounded-lg p-3">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Info. Nutricional</h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {data.calorias && (
          <div className="flex justify-between">
            <span className="text-gray-600">Calorías:</span>
            <span className="font-medium">{data.calorias}</span>
          </div>
        )}
        {data.proteinas && (
          <div className="flex justify-between">
            <span className="text-gray-600">Proteínas:</span>
            <span className="font-medium">{data.proteinas}g</span>
          </div>
        )}
        {data.carbohidratos && (
          <div className="flex justify-between">
            <span className="text-gray-600">Carbohidratos:</span>
            <span className="font-medium">{data.carbohidratos}g</span>
          </div>
        )}
        {data.grasas && (
          <div className="flex justify-between">
            <span className="text-gray-600">Grasas:</span>
            <span className="font-medium">{data.grasas}g</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderBadgesVariant = () => (
    <div className="flex flex-wrap gap-2">
      {data.calorias && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          🔥 {data.calorias} cal
        </span>
      )}
      {data.proteinas && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          💪 {data.proteinas}g proteína
        </span>
      )}
      {data.carbohidratos && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          🌾 {data.carbohidratos}g carbohidratos
        </span>
      )}
      {data.grasas && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          🥑 {data.grasas}g grasas
        </span>
      )}
    </div>
  );

  const renderChartVariant = () => {
    const total = (data.proteinas || 0) + (data.carbohidratos || 0) + (data.grasas || 0);
    
    if (total === 0) return renderCompactVariant();

    const proteinPercent = ((data.proteinas || 0) / total) * 100;
    const carbPercent = ((data.carbohidratos || 0) / total) * 100;
    const fatPercent = ((data.grasas || 0) / total) * 100;

    return (
      <div className="bg-white border rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribución de Macronutrientes</h4>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
          <div className="h-4 flex">
            <div 
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
              title={`Proteínas: ${data.proteinas}g (${proteinPercent.toFixed(1)}%)`}
            />
            <div 
              className="bg-yellow-500 h-full transition-all duration-300"
              style={{ width: `${carbPercent}%` }}
              title={`Carbohidratos: ${data.carbohidratos}g (${carbPercent.toFixed(1)}%)`}
            />
            <div 
              className="bg-orange-500 h-full transition-all duration-300"
              style={{ width: `${fatPercent}%` }}
              title={`Grasas: ${data.grasas}g (${fatPercent.toFixed(1)}%)`}
            />
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-3 text-xs">
          {data.proteinas && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Proteínas: {data.proteinas}g</span>
            </div>
          )}
          {data.carbohidratos && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Carbohidratos: {data.carbohidratos}g</span>
            </div>
          )}
          {data.grasas && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Grasas: {data.grasas}g</span>
            </div>
          )}
        </div>

        {data.calorias && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <span className="text-lg font-bold text-gray-900">{data.calorias}</span>
            <span className="text-sm text-gray-600 ml-1">calorías</span>
          </div>
        )}
      </div>
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 'compact':
        return renderCompactVariant();
      case 'badges':
        return renderBadgesVariant();
      case 'chart':
        return renderChartVariant();
      default:
        return renderDetailedVariant();
    }
  };

  // Verificar si hay datos nutricionales
  const hasData = Object.values(data).some(value => value !== undefined && value !== null);

  if (!hasData) {
    return (
      <div className={cn("text-sm text-gray-500 italic", className)}>
        Información nutricional no disponible
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {renderVariant()}
    </div>
  );
};

export default NutritionalInfo;
