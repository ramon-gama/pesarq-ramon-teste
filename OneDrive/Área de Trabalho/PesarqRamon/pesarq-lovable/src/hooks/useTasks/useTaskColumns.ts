
import { useMemo } from "react";
import { Task, Column } from "./types";

export function useTaskColumns(tasks: Task[]) {
  const columns = useMemo<Column[]>(() => {
    const baseColumns: Column[] = [
      { id: "todo", title: "A Fazer", tasks: [] },
      { id: "inprogress", title: "Em Andamento", tasks: [] },
      { id: "review", title: "Em Revisão", tasks: [] },
      { id: "done", title: "Concluído", tasks: [] }
    ];

    return baseColumns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.column_id === column.id)
    }));
  }, [tasks]);

  return columns;
}
