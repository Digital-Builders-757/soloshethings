# Incident Triage Procedure

**Purpose:** Incident response, escalation, and post-mortem process for SoloSheThings.

## Non-Negotiables

1. **User Impact First** - Prioritize incidents by user impact.
2. **Document Everything** - All incidents must be documented.
3. **Post-Mortem Required** - All critical incidents require post-mortem.
4. **Communication** - Keep team informed during incidents.
5. **Learn and Improve** - Use incidents to improve processes.

## Incident Severity Levels

### Critical (P0)

**Definition:** Complete service outage, data loss, security breach.

**Examples:**
- Application completely down
- Database unavailable
- Payment processing broken
- Security breach detected

**Response Time:** Immediate
**Resolution Target:** < 1 hour

### High (P1)

**Definition:** Major feature broken, significant user impact.

**Examples:**
- Authentication not working
- Subscription payments failing
- Data corruption
- Performance degradation (>50% users affected)

**Response Time:** < 15 minutes
**Resolution Target:** < 4 hours

### Medium (P2)

**Definition:** Feature partially broken, moderate user impact.

**Examples:**
- Some users can't access features
- Minor data inconsistencies
- Performance issues (affecting <50% users)
- UI bugs

**Response Time:** < 1 hour
**Resolution Target:** < 24 hours

### Low (P3)

**Definition:** Minor issues, low user impact.

**Examples:**
- Cosmetic bugs
- Minor performance issues
- Documentation errors
- Non-critical feature requests

**Response Time:** < 4 hours
**Resolution Target:** < 1 week

## Incident Response Workflow

### 1. Detection

**Sources:**
- Error monitoring (Sentry)
- User reports
- Team member discovery
- Automated alerts

### 2. Triage

**Assess:**
- Severity level
- User impact
- Affected systems
- Root cause (if known)

### 3. Response

**Immediate Actions:**
1. Acknowledge incident
2. Assess severity
3. Notify team
4. Start incident response

### 4. Resolution

**Steps:**
1. Identify root cause
2. Implement fix
3. Verify fix works
4. Monitor for recurrence

### 5. Post-Mortem

**Document:**
- What happened
- Why it happened
- How it was fixed
- How to prevent recurrence

## Incident Response Checklist

### Initial Response

- [ ] Incident detected and acknowledged
- [ ] Severity level assigned
- [ ] Team notified
- [ ] Incident documented
- [ ] User communication prepared (if needed)

### Investigation

- [ ] Root cause identified
- [ ] Affected systems documented
- [ ] User impact assessed
- [ ] Timeline established

### Resolution

- [ ] Fix implemented
- [ ] Fix verified
- [ ] Monitoring increased
- [ ] User communication sent (if needed)

### Post-Incident

- [ ] Incident documented
- [ ] Post-mortem scheduled
- [ ] Follow-up actions identified
- [ ] Process improvements noted

## Communication

### Internal Communication

**Slack/Team Chat:**
```
🚨 INCIDENT: [Severity] [Brief Description]

Status: Investigating
Impact: [User impact description]
ETA: [Estimated resolution time]

Updates will be posted here.
```

### User Communication (If Needed)

**For Critical/High Severity:**

```markdown
We're currently experiencing [issue description]. 
We're working to resolve this as quickly as possible.
We'll update you as soon as we have more information.

Thank you for your patience.
```

## Common Incident Types

### Application Down

**Symptoms:**
- 500 errors
- Timeout errors
- Application not loading

**Investigation:**
1. Check Vercel deployment status
2. Check build logs
3. Check environment variables
4. Check database connection

**Resolution:**
1. Rollback if recent deployment
2. Check for code errors
3. Verify environment variables
4. Restart if needed

### Database Issues

**Symptoms:**
- Database connection errors
- Query timeouts
- RLS policy errors

**Investigation:**
1. Check Supabase status
2. Check database logs
3. Verify RLS policies
4. Check for migration issues

**Resolution:**
1. Check Supabase dashboard
2. Verify migrations
3. Check RLS policies
4. Contact Supabase support if needed

### Payment Issues

**Symptoms:**
- Payments not processing
- Webhook errors
- Subscription status incorrect

**Investigation:**
1. Check Stripe dashboard
2. Check webhook logs
3. Verify webhook signatures
4. Check subscription status in database

**Resolution:**
1. Verify Stripe configuration
2. Check webhook endpoint
3. Manually sync subscriptions if needed
4. Contact Stripe support if needed

### Authentication Issues

**Symptoms:**
- Users can't log in
- Session errors
- Redirect loops

**Investigation:**
1. Check Supabase Auth status
2. Check middleware
3. Verify environment variables
4. Check session handling

**Resolution:**
1. Verify Supabase Auth configuration
2. Check middleware logic
3. Clear caches if needed
4. Test authentication flow

## Post-Mortem Template

### Incident Summary

**Date:** YYYY-MM-DD  
**Duration:** X hours  
**Severity:** P0/P1/P2/P3  
**Impact:** [User impact description]

### Timeline

- **HH:MM** - Incident detected
- **HH:MM** - Investigation started
- **HH:MM** - Root cause identified
- **HH:MM** - Fix implemented
- **HH:MM** - Incident resolved

### Root Cause

[Detailed explanation of what caused the incident]

### Resolution

[How the incident was resolved]

### Prevention

**Actions to prevent recurrence:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Follow-Up

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3

## Escalation

### When to Escalate

- Incident not resolved within target time
- Need additional expertise
- User impact increasing
- Security breach suspected

### Escalation Path

1. **On-Call Engineer** - Initial response
2. **Team Lead** - If not resolved quickly
3. **CTO/Founder** - For critical incidents
4. **External Support** - Supabase/Stripe support if needed

## Monitoring

### Key Metrics

- Error rate
- Response time
- Uptime
- User-reported issues

### Alerts

Configure alerts for:
- High error rate
- Slow response times
- Service outages
- Payment failures

## Incident Log

**Maintain log of all incidents:**

| Date | Severity | Description | Resolution | Post-Mortem |
|------|----------|-------------|------------|-------------|
| 2025-01-27 | P1 | Auth issue | Fixed middleware | Yes |

---

**Related Documents:**
- [RELEASE_PROCEDURE.md](./RELEASE_PROCEDURE.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [proof/MONITORING_SENTRY_POSTURE.md](./../proof/MONITORING_SENTRY_POSTURE.md)

