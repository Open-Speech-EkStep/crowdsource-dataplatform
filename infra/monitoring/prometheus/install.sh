kubectl create namespace prometheus

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts


helm upgrade -i prometheus prometheus-community/prometheus \
    --namespace prometheus \
    --set alertmanager.persistentVolume.storageClass="gp2",server.persistentVolume.storageClass="gp2"