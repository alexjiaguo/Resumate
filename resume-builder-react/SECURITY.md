# Security Documentation

## Overview
This document outlines the security measures implemented in the Resume Builder application.

## Security Measures Implemented

### 1. API Key Protection
- ✅ **Environment Variables**: All API keys moved to `.env` files
- ✅ **Git Ignore**: `.env` files excluded from version control
- ✅ **No Hardcoding**: Removed all hardcoded API keys from source code
- ⚠️ **Action Required**: Rotate the exposed API key `sk-Gmz2fYOszQNMVmz8WXeHIzSb7We69ZfA`

### 2. Input Validation
- ✅ **Zod Schemas**: Comprehensive validation for all user inputs
- ✅ **Email Validation**: RFC-compliant email format checking
- ✅ **URL Validation**: Sanitized and validated URLs
- ✅ **Length Limits**: Maximum length constraints on all text fields

### 3. XSS Prevention
- ✅ **DOMPurify**: HTML sanitization before rendering
- ✅ **CSP Headers**: Content Security Policy meta tag added
- ✅ **Allowed Tags**: Whitelist of safe HTML tags only
- ✅ **Attribute Filtering**: Only safe attributes allowed

### 4. Error Handling
- ✅ **Error Boundaries**: React error boundaries to catch component errors
- ✅ **Timeout Protection**: 30-second timeout on API calls
- ✅ **Retry Logic**: Exponential backoff for failed requests
- ✅ **User-Friendly Messages**: Clear error messages without exposing internals

### 5. Rate Limiting
- ✅ **Client-Side Rate Limiter**: Prevents API abuse
- ✅ **Configurable Limits**: 10 requests per 60 seconds default
- ✅ **Cooldown Period**: Shows time until next request available

### 6. Data Storage
- ⚠️ **localStorage**: Currently stores API keys (not ideal)
- ✅ **Basic Obfuscation**: Base64 encoding for sensitive data
- 🔄 **Future**: Move to server-side storage for production

## Security Best Practices

### For Development
1. **Never commit `.env` files** to git
2. **Use `.env.example`** as a template
3. **Rotate keys immediately** if accidentally exposed
4. **Test with dummy keys** when possible

### For Production
1. **Move API calls to backend** - Never expose keys to client
2. **Implement proper authentication** - User accounts with Supabase
3. **Use HTTPS only** - Enforce secure connections
4. **Add rate limiting on server** - Prevent abuse
5. **Implement audit logging** - Track security events
6. **Regular security audits** - Review code and dependencies

## Known Limitations

### Current Architecture (Client-Side Only)
- ❌ API keys stored in browser (localStorage)
- ❌ No server-side validation
- ❌ No user authentication
- ❌ No audit logging
- ❌ Limited rate limiting (client-side only)

### Recommended Migration Path
1. **Phase 1**: Move to Next.js with API routes
2. **Phase 2**: Implement Supabase authentication
3. **Phase 3**: Store API keys server-side only
4. **Phase 4**: Add proper rate limiting and monitoring

## Incident Response

### If API Key is Exposed
1. **Immediately rotate the key** at the provider's dashboard
2. **Check git history**: `git log -p | grep "sk-"`
3. **If in git history**: Consider using `git filter-branch` or BFG Repo-Cleaner
4. **Update `.env`** with new key
5. **Notify team members** to pull latest changes

### If XSS Vulnerability Found
1. **Identify the attack vector**
2. **Update DOMPurify configuration** if needed
3. **Add to CSP whitelist** if legitimate source
4. **Test thoroughly** before deploying fix

## Security Checklist

### Before Every Commit
- [ ] No API keys in code
- [ ] No sensitive data in comments
- [ ] Input validation on new fields
- [ ] Error messages don't leak info
- [ ] New dependencies audited

### Before Every Deploy
- [ ] Run `npm audit`
- [ ] Check `.env.example` is up to date
- [ ] Test error boundaries
- [ ] Verify CSP headers
- [ ] Test with invalid inputs

## Contact
For security concerns, contact: [your-email@example.com]

## References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Zod Documentation](https://zod.dev/)
