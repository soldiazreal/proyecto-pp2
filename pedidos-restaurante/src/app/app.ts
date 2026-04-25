import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="display:flex; height:100vh; font-family:Arial">

      <!-- IZQUIERDA -->
      <div style="width:20%; border:1px solid black; padding:10px">
        <h3>Salones</h3>
        <button style="width:100%; margin-bottom:10px">Salón 1</button>
        <button style="width:100%">Salón 2</button>
      </div>

      <!-- CENTRO -->
      <div style="width:60%; text-align:center; padding:10px">
        <h2>Mesas</h2>

        <div style="display:grid; grid-template-columns:repeat(3,80px); gap:15px; justify-content:center; margin-top:20px">
          <div style="border:1px solid black; padding:20px">1</div>
          <div style="border:1px solid black; padding:20px">2</div>
          <div style="border:1px solid black; padding:20px">3</div>
          <div style="border:1px solid black; padding:20px">4</div>
        </div>
      </div>

      <!-- DERECHA -->
      <div style="width:20%; border:1px solid black; padding:10px">
        <h3>Login</h3>
        <input placeholder="Usuario" style="width:100%; margin-bottom:5px">
        <input placeholder="Contraseña" type="password" style="width:100%; margin-bottom:5px">
        <button style="width:100%">Entrar</button>
      </div>

    </div>
  `
})
export class AppComponent {}