#!/bin/bash -e
aws cloudformation create-stack --stack-name cf-mbta-stack --template-body file://cfTemplate.yaml --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name cf-mbta-stack
# RoleARN=$(aws iam create-role --role-name mbta-lambda-role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' --query "Role.Arn" --output text)
# aws iam wait role-exists --role-name mbta-lambda-role
# echo "$RoleARN"
# aws iam put-role-policy --role-name mbta-lambda-role --policy-name lambda-permission --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["logs:*"],"Resource":"arn:aws:logs:*:*:*"},{"Effect":"Allow","Action":["s3:*"],"Resource":"arn:aws:s3:::*"}]}' 
aws lambda create-function --function-name MBTA-lambda --runtime nodejs14.x --zip-file fileb://blueline.zip --handler index.handler --role arn:aws:iam::620339869704:role/mbta-lambda-role
aws lambda wait function-exists --function-name MBTA-lambda
aws lambda add-permission --function-name MBTA-lambda --action lambda:InvokeFunctionUrl --principal "*" --function-url-auth-type "NONE" --statement-id url
aws lambda create-function-url-config --function-name MBTA-lambda --auth-type NONE
aws lambda update-function-code --function-name MBTA-lambda --zip-file fileb://blueline.zip

input="./input.txt"
while IFS= read -r line
do
    key=${line%% *}
    value=${line#* }
    aws dynamodb put-item --table-name MBTA_Stops --item '{"Trip" : {"S" : '$key'}, "Time" : {"N" : "'$value'"}}'
done < "$input"

echo "URL: " $(aws lambda get-function-url-config --function-name MBTA-lambda --query "[FunctionUrl]")
read -r -p "Press [Enter] key to terminate cf-mbta-stack ..."
aws cloudformation delete-stack --stack-name cf-mbta-stack
aws cloudformation wait stack-delete-complete --stack-name cf-mbta-stack
# aws iam delete-role --role-name mbta-lambda-role
aws lambda delete-function --function-name MBTA-lambda
echo "done"