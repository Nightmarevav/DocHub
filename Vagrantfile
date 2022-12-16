# -*- mode: ruby -*-
# vi: set ft=ruby :

unless Vagrant.has_plugin?("vagrant-docker-compose")
  system("vagrant plugin install vagrant-docker-compose")
  puts "Dependencies installed, please try the command again."
  exit
end

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--ioapic", "on"]
    vb.customize ["modifyvm", :id, "--memory", "4096"]
    vb.customize ["modifyvm", :id, "--cpus", "2"]
  end

  portWeb = 8080
  portPlantUML = 8079
  portDB = 27017
  docker_compose_version ="2.9.0"

  config.vm.network(:forwarded_port, guest: portWeb, host: portWeb)
  config.vm.network(:forwarded_port, guest: portPlantUML, host: portPlantUML)
  config.vm.network(:forwarded_port, guest: portDB, host: portDB)
  #config.vm.network :forwarded_port, guest: 22, host: 2200, id: 'ssh'
  #config.ssh.port = 2200
  
  config.vm.provision :shell, inline: "apt-get update"
  config.vm.provision :shell, inline: "export DOCKER_BUILDKIT=1" # or configure in daemon.json
  config.vm.provision :shell, inline: "export COMPOSE_DOCKER_CLI_BUILD=1"

   ## Avoid plugin conflicts
   if Vagrant.has_plugin?("vagrant-vbguest") then
    config.vbguest.auto_update = false
  end

 
  #install docker
  config.vm.provision :shell, inline: "sudo curl -fsSL https://get.docker.com -o get-docker.sh"
  config.vm.provision :shell, inline: "sudo DRY_RUN=1 sh ./get-docker.sh"
  
  #install docker-compose
  config.vm.provision :shell, inline: "sudo curl -SL \"https://github.com/docker/compose/releases/download/v2.9.0/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose"
  config.vm.provision :shell, inline: "sudo chmod +x /usr/local/bin/docker-compose"

  
  #install docker-compose
  #config.vm.provision :shell, path: "scripts/install.sh"
  
  #build docker-compose
  config.vm.provision :shell, path: "scripts/build.sh"
  #run docker-compose
  config.vm.provision :shell, path: "scripts/run.sh" , run: 'always'
  
  #config.vm.provision :docker
  #config.vm.provision :docker_compose,
    # compose_version: "1.29.2"
  #  compose_version: "2.90.0"
 
 
#     env: { "PORT" => "#{portWeb}"},
#     #,"COMPOSE_DOCKER_CLI_BUILD"=>1,"DOCKER_BUILDKIT"=>1},
#     #executable_symlink_path:"COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 #{executable_symlink_path }",
#     #options:{"COMPOSE_DOCKER_CLI_BUILD"=>1, "DOCKER_BUILDKIT"=>1},
#     yml: "/vagrant/docker-compose.yaml",
#     rebuild: false,
#     project_name: "archdochub",
#     run: "always"
end
