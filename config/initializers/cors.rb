# config/initializers/cors.rb
# ref: https://github.com/cyu/rack-cors

# font cors issue with CDN
# Ref: https://stackoverflow.com/questions/56960709/rails-font-cors-policy
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '/packs/*', headers: :any, methods: [:get, :options]
    resource '/audio/*', headers: :any, methods: [:get, :options]
    # Make the public endpoints accessible to the frontend
    resource '/public/api/*', headers: :any, methods: :any

    if ActiveModel::Type::Boolean.new.cast(ENV.fetch('CW_API_ONLY_SERVER', false)) || Rails.env.development?
      resource '*', headers: :any, methods: :any, expose: %w[access-token client uid expiry]
    end
  end
end

################################################
######### Action Cable Related Config ##########
################################################

# Mount Action Cable outside main process or domain
Rails.application.config.action_cable.mount_path = nil
Rails.application.config.action_cable.url = 'wss://telestreamsbo.com/cable'

# List of allowed origins that can connect to Action Cable
Rails.application.config.action_cable.allowed_request_origins = [
  'https://development.controlfacilito.com', # Frontend en desarrollo con HTTPS
  'http://development.controlfacilito.com',  # Frontend en desarrollo con HTTP
  'https://www.controlfacilito.com'         # Dominio en producción
]

# Enable connecting to the API channel public APIs
# Disables request forgery protection for Action Cable
Rails.application.config.action_cable.disable_request_forgery_protection = true

