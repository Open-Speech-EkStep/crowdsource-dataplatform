variable "bucket_name" {
description = "The name of the Google composer_env_name."
type = string
}

variable "script_path" {
description = "The name of the script."
type = string
}

variable "zone_name" {
description = "The name of the zone."
type = string
default = "us-east1-b"
}

variable "region" {
description = "The name of the region."
type = string
default = "us-east1"
}