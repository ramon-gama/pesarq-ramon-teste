
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { AdvancedFilters } from "./AdvancedFilters";

interface CollapsibleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Array<{
    key: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }>;
  yearFilter: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  };
  onClearFilters: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function CollapsibleFilters({
  searchTerm,
  onSearchChange,
  filters,
  yearFilter,
  onClearFilters,
  onExportPDF,
  onExportExcel
}: CollapsibleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters
  const activeFiltersCount = filters.filter(filter => filter.value !== "all").length + 
                            (yearFilter.value !== "all" ? 1 : 0) +
                            (searchTerm ? 1 : 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filtros</CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <AdvancedFilters
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            filters={filters}
            yearFilter={yearFilter}
            onClearFilters={onClearFilters}
            onExportPDF={onExportPDF}
            onExportExcel={onExportExcel}
          />
        </CardContent>
      )}
    </Card>
  );
}
