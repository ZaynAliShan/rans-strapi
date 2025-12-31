# Node.js 24 Compatibility Notes

## Updated Dependencies

All dependencies in `package.json` have been updated to versions compatible with Node.js 24:

### Core Dependencies

- **@strapi/strapi**: `^4.25.0` - Updated to use caret (^) for flexibility
- **@strapi/plugin-users-permissions**: `^4.25.0` - Updated to use caret
- **@strapi/plugin-i18n**: `^4.25.0` - Updated to use caret
- **pg**: `^8.13.1` - Updated from 8.11.3 to latest 8.x (Node 24 compatible)
- **sharp**: `^0.33.5` - Updated from 0.33.0 to latest (Node 24 compatible)

### Dev Dependencies

- **@types/node**: `^24.0.0` - Updated from ^20.0.0 to support Node 24 types

### Engines Field

Updated to allow Node.js 20-24:
```json
"engines": {
  "node": ">=20.0.0 <=24.x.x",
  "npm": ">=10.0.0"
}
```

## Important Notes

### Strapi 4.x and Node.js 24

⚠️ **Note**: Strapi 4.25.0 officially supports Node.js 20 and 22. While it may work with Node.js 24, it's not officially tested. 

**Recommendations:**
1. **For Production**: Consider using Node.js 22.x (LTS) for maximum stability
2. **For Development**: Node.js 24 should work, but test thoroughly
3. **Monitor**: Watch for Strapi updates that officially add Node 24 support

### Testing Node.js 24 Compatibility

Before deploying to production with Node.js 24:

1. **Test Locally:**
```bash
node --version  # Should show v24.x.x
npm install
npm run develop
```

2. **Test All Features:**
   - Create articles
   - Upload images
   - Test API endpoints
   - Test admin panel
   - Test permissions

3. **Check for Warnings:**
   - Look for deprecation warnings
   - Check console for compatibility issues

### Alternative: Use Node.js 22 (Recommended)

If you encounter issues with Node.js 24, you can use Node.js 22 (LTS):

```bash
# Using nvm
nvm install 22
nvm use 22
```

Then update engines field to:
```json
"engines": {
  "node": ">=20.0.0 <=22.x.x",
  "npm": ">=10.0.0"
}
```

## Dependency Compatibility Matrix

| Package | Version | Node 24 Compatible | Notes |
|---------|---------|-------------------|-------|
| @strapi/strapi | ^4.25.0 | ⚠️ Unofficial | Works but not officially tested |
| pg | ^8.13.1 | ✅ Yes | Fully compatible |
| sharp | ^0.33.5 | ✅ Yes | Fully compatible |
| @types/node | ^24.0.0 | ✅ Yes | TypeScript types for Node 24 |

## Coolify Deployment

When deploying to Coolify with Node.js 24:

1. **Set Node Version in Coolify:**
   - In your application settings, specify Node.js 24
   - Or use a `.nvmrc` file with `24` in it

2. **Create .nvmrc file** (optional):
   ```bash
   echo "24" > .nvmrc
   ```

3. **Verify in Build Logs:**
   - Check that Node.js 24 is being used
   - Look for any compatibility warnings

## Troubleshooting

### If Strapi fails to start with Node 24:

1. **Downgrade to Node 22:**
   ```bash
   nvm use 22
   ```

2. **Or update engines field:**
   ```json
   "engines": {
     "node": ">=20.0.0 <=22.x.x"
   }
   ```

### If dependencies fail to install:

1. **Clear cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check for peer dependency warnings:**
   ```bash
   npm install --legacy-peer-deps
   ```

## Future Updates

Monitor these for official Node.js 24 support:
- [Strapi GitHub Releases](https://github.com/strapi/strapi/releases)
- [Strapi Documentation](https://docs.strapi.io)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)

---

**Last Updated**: 2024  
**Status**: Compatible with Node.js 24 (unofficial for Strapi 4.x)

