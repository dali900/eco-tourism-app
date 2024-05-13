import { ref } from 'vue'

export function useBuildMenuRecursively() {
    /**
     * 
     * @param {Array} menuItems created menu array
     * @param {Array} categories items to insert
     * @param {string} menuName url link
     * @returns 
     */
    const insertMenuItems = (menuItems, categories, menuName) => {
        categories.forEach((category) => {
            const menuItem = {
                label: category.name,
                to: "/" + menuName + "/" + category.id,
                route: {name: menuName, params: {id: category.id}},
            };

            if (category.children.length > 0) {
                menuItem.items = [];
                insertMenuItems(menuItem.items, category.children, menuName);
            }

            menuItems.push(menuItem);
        });
        return 
    };

    /**
     * 
     * @param {Array} nodes created tree array
     * @param {Array} categories items to insert
     * @returns 
     */
    const insertTreeItems = (nodes, categories) => {
        categories.forEach((category) => {
            const menuItem = {
                id: category.id,
                label: category.name,
                created: category.created_at_formated,
                children: [],
            };

            if (category.children.length > 0) {
                insertTreeItems(menuItem.children, category.children);
            }

            nodes.push(menuItem);
        });
        return 
    };

    //buildMenu(builtMenu.value, regulationTypes);

    return { insertMenuItems, insertTreeItems };
}
