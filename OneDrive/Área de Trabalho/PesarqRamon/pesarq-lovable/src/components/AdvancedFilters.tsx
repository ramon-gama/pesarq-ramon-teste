
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Calendar, Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterOption {
  value: string;
  label: string;
}

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  yearFilter?: {
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  };
  onClearFilters?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function AdvancedFilters({ 
  searchTerm, 
  onSearchChange, 
  filters,
  yearFilter,
  onClearFilters,
  onExportPDF,
  onExportExcel
}: AdvancedFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const hasActiveFilters = filters.some(filter => filter.value !== "all") || 
                          searchTerm !== "" || 
                          (yearFilter && yearFilter.value !== "all");

  return (
    <div className="space-y-4">
      {/* Barra de busca sempre visível */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Botão para mostrar/esconder filtros */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {hasActiveFilters && (
                <span className="ml-1 h-2 w-2 bg-blue-500 rounded-full"></span>
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-lg border">
              {yearFilter && (
                <Select value={yearFilter.value} onValueChange={yearFilter.onChange}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearFilter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {filters.map((filter) => (
                <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              
              {hasActiveFilters && onClearFilters && (
                <Button 
                  variant="outline" 
                  onClick={onClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Export buttons */}
      {(onExportPDF || onExportExcel) && (
        <div className="flex flex-wrap gap-2">
          {onExportPDF && (
            <Button 
              variant="outline" 
              onClick={onExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
          )}
          {onExportExcel && (
            <Button 
              variant="outline" 
              onClick={onExportExcel}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
