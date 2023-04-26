import MenuItem  from "./entities/menu-item.entity";
export class MenuItemsService {
  /* TODO: complete getMenuItems so that it returns a nested menu structure
    Requirements:
    - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - post process your results in javascript
    Hints:
    - open the `src/menu-items/menu-items.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /menu:
    ```json
    [
        {
            "id": 1,
            "name": "All events",
            "url": "/events",
            "parentId": null,
            "createdAt": "2021-04-27T15:35:15.000000Z",
            "children": [
                {
                    "id": 2,
                    "name": "Laracon",
                    "url": "/events/laracon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 3,
                            "name": "Illuminate your knowledge of the laravel code base",
                            "url": "/events/laracon/workshops/illuminate",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 4,
                            "name": "The new Eloquent - load more with less",
                            "url": "/events/laracon/workshops/eloquent",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Reactcon",
                    "url": "/events/reactcon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 6,
                            "name": "#NoClass pure functional programming",
                            "url": "/events/reactcon/workshops/noclass",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 7,
                            "name": "Navigating the function jungle",
                            "url": "/events/reactcon/workshops/jungle",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
  */

  // Get all top-level menu items (items without parent)
  async getMenuItems(): Promise<any> {
    // Fetch all menu items that have no parent
    const rootItems = await MenuItem.findAll({ where: { parentId: null } });

    // Create an empty array to store menu items
    const menuItems = [];

    // Loop through each root item and get its children recursively
    for (const item of rootItems) {
      const menuItem = item.toJSON(); // Convert the item to a JSON object
      menuItem.children = await this.getChildren(item.id); // Get the children of the current item
      menuItems.push(menuItem); // Add the item and its children to the menu items array
    }

    // Return the menu items array
    return menuItems;
  }

  // A private helper function to recursively get the children of a menu item
  private async getChildren(parentId: number): Promise<any> {
    // Fetch all children of the parent item
    const children = await MenuItem.findAll({ where: { parentId } });

     // Create an empty array to store the child menu items
    const result = [];

    // Loop through each child and get its children recursively
    for (const child of children) {
      const childItem = child.toJSON(); // Convert the child to a JSON object
      childItem.children = await this.getChildren(child.id); // Get the children of the current child
      result.push(childItem); // Add the child and its children to the result array
    }

    // Return the result array
    return result;
  }
}
