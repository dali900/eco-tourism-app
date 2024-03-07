import { ref } from 'vue'

export function useBuildMenuRecursively() {
    /**
     * 
     * @param {Array} menuItems created menu array
     * @param {Array} types items to insert
     * @param {string} menuName url link
     * @returns 
     */
    const insertMenuItems = (menuItems, types, menuName) => {
        types.forEach((type) => {
            const menuItem = {
                label: type.name,
                to: "/" + menuName + "/" + type.id,
                items: [],
            };

            if (type.children.length > 0) {
                insertMenuItems(menuItem.items, type.children, menuName);
            }

            menuItems.push(menuItem);
        });
        return 
    };

    /**
     * 
     * @param {Array} nodes created tree array
     * @param {Array} types items to insert
     * @returns 
     */
    const insertTreeItems = (nodes, types) => {
        types.forEach((type) => {
            const menuItem = {
                id: type.id,
                label: type.name,
                created: type.created_at_formated,
                children: [],
            };

            if (type.children.length > 0) {
                insertTreeItems(menuItem.children, type.children);
            }

            nodes.push(menuItem);
        });
        return 
    };

    //buildMenu(builtMenu.value, regulationTypes);

    return { insertMenuItems, insertTreeItems };
}
