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

output "worker_groups" {
  value = local.worker_groups
}

output "cluster_autoscaler_role_arn" {
  value = module.iam_assumable_role_admin.this_iam_role_arn
}

output "cloud_provider" {
  value = "aws"
}