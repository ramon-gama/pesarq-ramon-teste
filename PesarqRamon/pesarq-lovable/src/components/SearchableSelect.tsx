
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Plus } from "lucide-react";
import { ServiceTypeRequestModal } from "./ServiceTypeRequestModal";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  searchPlaceholder?: string;
  onRequestNew?: (searchTerm: string) => void;
  allowRequestNew?: boolean;
}

export function SearchableSelect({ 
  value, 
  onValueChange, 
  placeholder = "Selecione uma opção",
  options,
  searchPlaceholder = "Buscar...",
  allowRequestNew = false
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Improved search: more flexible word matching
  const filteredOptions = options.filter(option => {
    // Ensure option has valid value and label
    const hasValidValue = option.value && 
                         typeof option.value === 'string' && 
                         option.value.trim() !== "";
    const hasValidLabel = option.label && 
                         typeof option.label === 'string' && 
                         option.label.trim() !== "";
    
    if (!hasValidValue || !hasValidLabel) return false;
    
    // If no search term, show all valid options
    if (!searchTerm) return true;
    
    // Normalize strings for better matching
    const normalizeString = (str: string) => 
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '') // Remove accents
         .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
         .replace(/\s+/g, ' ') // Normalize spaces
         .trim();
    
    const normalizedLabel = normalizeString(option.label);
    const normalizedSearch = normalizeString(searchTerm);
    
    // Split search into words and check if all words are found
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
    
    // Each search word should be found as a substring in the label
    return searchWords.every(word => normalizedLabel.includes(word));
  });

  const handleRequestNew = () => {
    setShowRequestModal(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="sticky top-0 bg-white border-b p-2 z-10">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    Nenhuma opção encontrada
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        {allowRequestNew && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRequestNew}
                  className="shrink-0 h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Solicitar novo tipo de serviço</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <ServiceTypeRequestModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        initialTypeName={searchTerm}
      />
    </>
  );
}
