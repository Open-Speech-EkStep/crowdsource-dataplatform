output "cluster_endpoint" {
  description = "Endpoint for EKS control plane."
  value       = module.eks-cluster.cluster_endpoint
}

output "region" {
  description = "AWS region."
  value       = var.k8s_cluster.region
}

output "cluster_name" {
  description = "Cluster name"
  value       = var.k8s_cluster.cluster_name
}

output "kubeconfig_path" {
  description = "Path to kubeconfig file"
  value       = abspath(module.eks-cluster.kubeconfig_filename)
}

output "update_kubeconfig" {
  description = "Command to update kubeconfig"
  value       = "aws eks update-kubeconfig --name ${var.k8s_cluster.cluster_name}"
}

output "cloud_provider" {
  value = "aws"
}