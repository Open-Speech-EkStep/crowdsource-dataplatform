locals {
  autoscaling_tags = [
    {
      key                 = "k8s.io/cluster-autoscaler/enabled"
      propagate_at_launch = "true"
      value               = "true"
    },
    {
      key                 = "k8s.io/cluster-autoscaler/${var.k8s_cluster.cluster_name}"
      propagate_at_launch = "true"
      value               = "true"
    }
  ]

  worker_groups = [for index, worker_group in var.worker_groups :
    merge(worker_group, {
      tags = concat(local.autoscaling_tags, worker_group.tags)
      }
    )
  ]

  worker_additional_security_group_ids = aws_security_group.private-instances[*].id
}
