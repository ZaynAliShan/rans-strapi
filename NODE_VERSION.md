# Node.js Version Requirements

## Current Requirements

**Strapi 4.x requires:** Node.js `>=18.0.0 <=20.x.x`

This project is configured to use **Node.js 20.x** (LTS), which is the recommended version.

## Why Node.js 20?

1. **Official Support**: Strapi 4.x officially supports Node.js 18 and 20
2. **LTS Status**: Node.js 20 is the current Long-Term Support (LTS) version
3. **Stability**: LTS versions receive security updates and bug fixes
4. **Compatibility**: All Strapi packages are tested and verified with Node.js 20

## Node.js 24 Compatibility

❌ **Node.js 24 is NOT supported** by Strapi 4.x

If you try to install with Node.js 24, you'll see warnings like:
```
npm warn EBADENGINE Unsupported engine {
  package: '@strapi/strapi@4.26.0',
  required: { node: '>=18.0.0 <=20.x.x' },
  current: { node: 'v24.9.0' }
}
```

## Switching to Node.js 20

### Using nvm (Node Version Manager)

```bash
# Install Node.js 20 if not already installed
nvm install 20

# Use Node.js 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x

# Set as default (optional)
nvm alias default 20
```

### Using .nvmrc file

The project includes a `.nvmrc` file with `20`. If you have nvm installed:

```bash
cd /Users/macbookpro/Desktop/Rans/Strapi
nvm use  # Automatically uses Node.js 20
```

### Without nvm

Download and install Node.js 20 from:
- [Node.js Official Website](https://nodejs.org/)
- Choose the LTS version (20.x)

## Verification

After switching to Node.js 20:

```bash
# Check Node version
node --version  # Should show v20.x.x

# Check npm version
npm --version

# Install dependencies (should not show engine warnings)
npm install
```

## Coolify Deployment

When deploying to Coolify:

1. **Set Node.js Version:**
   - In Coolify application settings
   - Set Node.js version to `20` or `20.x`

2. **Or use .nvmrc:**
   - The `.nvmrc` file with `20` will be automatically detected

## Future Updates

When Strapi adds support for newer Node.js versions:
- Monitor [Strapi Releases](https://github.com/strapi/strapi/releases)
- Check [Strapi Documentation](https://docs.strapi.io) for version requirements
- Update `.nvmrc` and `package.json` engines field accordingly

---

**Current Configuration:**
- Node.js: 20.x (LTS)
- npm: 6+ (comes with Node.js 20)
- Strapi: 4.26.0

**Last Updated:** 2024

