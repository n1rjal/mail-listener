# Mail Listener

Listens for new mail on your imap server and perofmr POST request to a webhook URL.

## Environment variables needed:

You can format the given information into a Markdown table like this:

| Variable    | Value                 | Description             |
| ----------- | --------------------- | ----------------------- |
| PASSWORD    | Password              | password of imap server |
| USERNAME    | user@example.com      | username of imap server |
| HOST        | imap.example.com      | host of imap server     |
| PORT        | 993                   | port of imap server     |
| WEBHOOK_URL | http://127.0.0.1:3000 | Webhook send request to |

## Docker usage

Please note that this image doesn't need any open ports to run and hence the docker image is without `EXPOSE`.

## Future Features

1. Publish to SQS Queue
2. Publish to RABBITMQ exchange
