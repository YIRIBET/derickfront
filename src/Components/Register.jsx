import React, { useState } from 'react';
const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e) => {
        e.preventDefault();
        // Lógica de autenticación
        console.log('Username:', username);
        console.log('Password:', password);
      };
  
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Form section */}
        <div className="flex w-full items-center justify-center p-4 md:w-1/2 ">
          <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-5 m-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Registrate con nosotros</h2>
            </div>
  
            <form  className="mt-8 space-y-6">
              <div className="space-y-4">
              <div className="space-y-2">
                  <label htmlFor="email" class="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white" > Nombre completo</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Juan Perez"
                    value={name}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" class="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white" >Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
  
                <div className="space-y-2">
                  <label htmlFor="password" class="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white">Contraseña</label>
                  <div className="relative ">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/*showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )*/}
                      <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </button>
                  </div>
                </div>
              </div>
  
  
              <button type="submit" className="w-full bg-black text-white rounded-xl p-3">
               Registrar
              </button>
  
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a href="#" className="font-medium text-primary hover:text-primary/90">
                  Inicia sesión
                </a>
              </div>
            </form>
          </div>
        </div>
         {/* Image section */}
         <div className="flex w-full items-center justify-center bg-primary/10 md:w-1/2">
          <img
            src="https://www.truefoodkitchen.com/wp-content/uploads/2025/01/TFK016_01f_A1B00195-Enhanced-NR_v02.jpg"
            alt="Login illustration"
            className="h-auto max-h-[400px] w-auto max-w-full object-cover p-6 md:max-h-[900px]"
          />
        </div>
      </div>
  );
};

export default Register;
