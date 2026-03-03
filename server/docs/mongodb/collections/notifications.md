# notifications

## Key Fields
- `type`
- `title.en/ar`, `message.en/ar`
- `recipientType`, `recipientQuery`, `recipientIds`
- `channels`, `navigation`, `priority`
- `status`, `scheduleAt`, `sentAt`
- `metrics`

## Indexes
- `{ status: 1, scheduleAt: 1 }`
- `{ createdBy: 1, createdAt: -1 }`
