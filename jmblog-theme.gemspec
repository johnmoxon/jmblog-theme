# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "jmblog-theme"
  spec.version       = "1.1.6"
  spec.authors       = ["John Moxon"]
  spec.email         = ["jmoxon@gmail.com"]

  spec.summary       = "Clean minimalist blog theme inspired by Wix train of thought"
  spec.homepage      = "https://www.jmoxon.net"
  spec.license       = "MIT"
  
  require 'rake'
  spec.files         = FileList['_layouts/**/*', 
                                '_includes/**/*',
                                '_authors/**/*',
                                '_data/**/*',
                                '_pages/**/*',
                                '_posts/**/*',
                                'assets/**/*',
                                '_config.yml',
                                'index.html',
                                'LICENSE.txt',
                                'README.md'].to_a

#  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

#  spec.extra_rdoc_files = Dir["../README.md", "../LICENSE.txt"]
  # spec.add_runtime_dependency "jekyll", "~> 3.8"
  spec.add_runtime_dependency "github-pages"

  spec.add_development_dependency "bundler", "~> 2.1.4"
  spec.add_development_dependency "rake", "~> 13.0.1"
end
