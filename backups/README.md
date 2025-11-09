# Database backups directory
# Store your database backups here

## Backup Commands

### Development
```bash
# Create backup
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres -d papelisco_dev > backups/dev_backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d papelisco_dev < backups/your_backup_file.sql
```

### Production
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres -d papelisco_prod > backups/prod_backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d papelisco_prod < backups/your_backup_file.sql
```

## Automated Backups

The production environment includes an automated backup service that creates daily backups.

## Backup Best Practices

1. **Regular Backups**: Create backups before major changes
2. **Test Restores**: Regularly test backup restoration
3. **Multiple Locations**: Store backups in multiple locations
4. **Retention Policy**: Keep appropriate backup history
5. **Compression**: Compress large backups to save space

```bash
# Compressed backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres -d papelisco_prod | gzip > backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore compressed backup
gunzip -c backups/backup_file.sql.gz | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d papelisco_prod
```