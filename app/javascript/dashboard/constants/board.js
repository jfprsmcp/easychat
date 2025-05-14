const COLUMN_DEFAULT = 0

const mapKanbanState = (kanbanState) => {
    if (isColumnOrderZero(kanbanState)) {
        return {
            id: null,
            name: null,
            order: null,
            color: null
        }
    }
    return {
        id: kanbanState.id,
        name: kanbanState.name,
        order: kanbanState.order,
        color: kanbanState.color
    }
} 

const isColumnOrderZero = (kanbanState) => {
  return kanbanState.order == COLUMN_DEFAULT
}

export default {
    COLUMN_DEFAULT,
    isColumnOrderZero,
    mapKanbanState,
}