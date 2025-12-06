# Changelog

## Latest Updates

### Fixed Issues
- ✅ **Fixed "Failed to create project" error** - Improved error handling with detailed error messages
- ✅ **Better error messages** - Now shows specific error details instead of generic failure messages

### New Features
- ✅ **Multi-Page Support** - Websites can now have multiple pages
- ✅ **Page Management UI** - Add, delete, rename, and switch between pages
- ✅ **Page Counter** - Dashboard now shows how many pages each website has
- ✅ **Backward Compatibility** - Old projects with single-page format are automatically migrated

### Improvements
- ✅ Enhanced error handling throughout the application
- ✅ Better user feedback on errors
- ✅ Improved project structure for scalability

## How to Use Multi-Page Feature

1. **Create a Project** - Create a new website project (starts with "Home" page)
2. **Add Pages** - Click the "+" button in the page manager (top of left sidebar)
3. **Switch Pages** - Click on any page name to edit that page
4. **Rename Pages** - Click on the page name and type a new name
5. **Delete Pages** - Click the "×" button next to a page (minimum 1 page required)

## Technical Details

### Data Structure
Projects now use a `pages` array instead of a single `components` array:

```json
{
  "id": "project-id",
  "name": "My Website",
  "pages": [
    {
      "id": "page-1",
      "name": "Home",
      "components": [...]
    },
    {
      "id": "page-2",
      "name": "About",
      "components": [...]
    }
  ]
}
```

### Migration
Old projects are automatically migrated when loaded. The old `components` array is converted to a page structure.

