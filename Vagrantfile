# -*- mode: ruby -*-
# vi: set ft=ruby :

unless Vagrant.has_plugin?("vagrant-docker-compose")
  system("vagrant plugin install vagrant-docker-compose")
  puts "Dependencies installed, please try the command again."
  exit
end

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 4096
    v.cpus = 2
  end

  portWeb = 8080
  portDB = 27017

  config.vm.network(:forwarded_port, guest: portWeb, host: portWeb)
  config.vm.network(:forwarded_port, guest: portDB, host: portDB)
  #config.vm.network :forwarded_port, guest: 22, host: 2200, id: 'ssh'
  #config.ssh.port = 2200
  
  #config.vm.provision :shell, inline: "apt-get update"
  config.vm.provision :shell, inline: "export DOCKER_BUILDKIT=1 # or configure in daemon.json"
  config.vm.provision :shell, inline: "export COMPOSE_DOCKER_CLI_BUILD=1"

   ## Avoid plugin conflicts
   if Vagrant.has_plugin?("vagrant-vbguest") then
    config.vbguest.auto_update = false
  end

  config.vm.provision :docker
  config.vm.provision :docker_compose,
     compose_version: "1.29.2",
     env: { "PORT" => "#{portWeb}","COMPOSE_DOCKER_CLI_BUILD"=>1,"DOCKER_BUILDKIT"=>1},
     #executable_symlink_path:"COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 #{executable_symlink_path }",
     #options:{"COMPOSE_DOCKER_CLI_BUILD"=>1, "DOCKER_BUILDKIT"=>1},
     yml: ["/vagrant/docker-compose.yaml"],
     rebuild: true,
     project_name: "archdochub",
     run: "always"
end
