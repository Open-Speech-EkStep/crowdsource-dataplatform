#!/bin/sh
langs=("en")
for i in $langs;
do
    for en_row in $(jq 'keys[] as $k| .[$k] | {"key":$k, "value":@base64}' "crowdsource-fe/public/locales/${i}/common.json"); 
        do
        echo ${en_row}

        # v= $(jq --arg v "${en_row}" '.[] | select(.==$v)' "crowdsource-ui/locales/en.json")
        done
    # $(mkdir ${i})
    # $(jq '.' "crowdsource-fe/public/locales/${i}/common.json" > "${i}/mig.json")
done