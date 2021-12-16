const productoDOM = document.querySelector(".productos__center")
const producto2DOM = document.querySelector(".productos__center2")
const carritoDOM = document.querySelector(".carrito")
const carritoCenter = document.querySelector(".carrito__center")
const openCarrito = document.querySelector(".carrito__icon")
const closeCarrito = document.querySelector(".close__carrito")
const overlay = document.querySelector(".carrito__overlay")
const carritoTotal = document.querySelector(".carrito__total")
const clearCarritoBtn = document.querySelector(".clear__carrito")
const itemTotales =document.querySelector(".item__total")
const detalles = document.getElementById('detalles')

let carrito = [];
let buttonDOM = [];

class UI {

	detalleProducto(id){
		const filtroDato = productos.filter(item => item.id == id)
		let result = ""
		filtroDato.forEach(producto => {
			result += `
			<div class="container pb-5 ">
        <div class="row">
            <div class="col-lg-5 mt-5">
                <div class="card mb-3">
                    <img class="card-img img-fluid" src=${producto.image} alt="Card image cap" id="product-detail">
                </div>
            </div>
            <!-- col end -->
            <div class="col-lg-7 mt-5">
                <div class="card bg-success text-light">
                    <div class="card-body">
                        <h1 class="h2">${producto.title}</h1>
                        <p class="h3 py-2">S/${producto.price}</p>
            
                        <ul class="list-inline">
                            <li class="list-inline-item">
                                <h6>Marca:</h6>
                            </li>
                            <li class="list-inline-item">
                                <p class="text-dark"><strong>${producto.marca}</strong></p>
                            </li>
                        </ul>

                        <h6>Description:</h6>
                        <p>${producto.desc_larga}</p>
                                    <button type="submit" class="btn btn-dark addToCart" name="submit" value="addtocard" data-id=${producto.id} >Agregar al carrito</button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
			`
		});
		detalles.innerHTML = result;
	}

	renderProductos(productos){
		let result = ""
		productos.forEach((producto) =>{
			result += `

			<div class="col-6 col-xs-5 col-sm-6 col-lg-4 col-xl-3 mb-2 mt-3">
					<div class="producto">
    					<div class="card image__container">
      						<img class="card-img-top" src=${producto.image} alt="Card image cap">
      						<div class="card-body bg-success  producto__footer">
        						<h5 class="card-title text-light ">${producto.title}</h5>
									<h4 class="card-title text-light">S/${producto.price}</h4>	
        							<p class="card-text text-light">${producto.desc_corta}</p>
									<h6 class="card-text text-dark">${producto.marca}</h6>
        								<a href="#" class="btn btn-dark btn addToCart my-2" data-id=${producto.id} >Agregar al carrito</a>
        									<a href="/producto-detalles?id=${producto.id}" class="btn btn-dark btn view my-2">Ir al Detalle</a>
      						</div>
    					</div>
  					</div>
				</div>
				`
		});
		productoDOM.innerHTML = result
	}



	getButtons(){
		const buttons = [...document.querySelectorAll(".addToCart")];
		buttonDOM = buttons;
		buttons.forEach((button)=> {
			const id = button.dataset.id;
			const inCart = carrito.find(item => item.id === parseInt(id, 10));

			if(inCart){
				button.innerHTML = "Agregado";
				button.disabled = true;
			}
			button.addEventListener("click", e =>{
				e.preventDefault();
				e.target.innerHTML = "Añadido";
				e.target.disabled = true;
				

				// GET productos al carrito
				const carritoItem = {...Storage.getProductos(id), cantidad: 1}

				//agregamos el producto al carrito
				carrito = [...carrito, carritoItem]

				//Guardamos el carrito al localstorage
				Storage.saveCart(carrito)

				//Set cart values
				this.setItemValues(carrito)
				this.addCarritoItem(carritoItem)
				//Show al carrito
			})
		})
	}

	setItemValues(carrito){
		let tempTotal = 0;
		let itemTotal = 0;
		carrito.map(item => {
			tempTotal += item.price * item.cantidad;
			itemTotal += item.cantidad;
		});
		carritoTotal.innerText = parseFloat(tempTotal.toFixed(2));
		itemTotales.innerText = itemTotal
	}

	addCarritoItem({image, price, title, id}){
		const div = document.createElement("div")
		div.classList.add("carrito__item")

		div.innerHTML = `
		<img src=${image} alt=${title}>
		<div>
			<h3>${title}</h3>
			<p class="price">S/ ${price}</p>
		</div>
		<div>
			<span class="increase" data-id=${id}>
				<i class="bx bxs-up-arrow"></i>
			</span>
			<p class="item__cantidad">1</p>
			<span class="decrease" data-id=${id}>
				<i class="bx bxs-down-arrow"></i>
			</span>
		</div>
		<div>
			<span class="remove__item" data-id=${id}>
				<i class="bx bx-trash"></i>
			</span>
		</div>
		`
		carritoCenter.appendChild(div)
	}
	show(){
		carritoDOM.classList.add("show")
		overlay.classList.add("show")
	}
	hide(){
		carritoDOM.classList.remove("show")
		overlay.classList.remove("show")
	}
	setAPP(){
		carrito = Storage.getCart()
		this.setItemValues(carrito)
		this.populate(carrito)
		openCarrito.addEventListener("click", this.show)
		closeCarrito.addEventListener("click", this.hide)
	}
	populate(carrito){
		carrito.forEach(item => this.addCarritoItem(item))
	}
	cartLogic(){
		clearCarritoBtn.addEventListener("click", () =>{
			this.clearCarrito()
			this.hide()
		});

		carritoCenter.addEventListener("click", e =>{
			const target = e.target.closest("span")
			const targetElement = target.classList.contains("remove__item");
			console.log(target)
			console.log(targetElement)
			if(!target) return
			if(targetElement){
				const id = parseInt(target.dataset.id);
				this.removeItem(id)
				carritoCenter.removeChild(target.parentElement.parentElement)
			}else if(target.classList.contains("increase")){
				const id = parseInt(target.dataset.id, 10);
				let tempItem = carrito.find(item => item.id === id);
				tempItem.cantidad++;
				Storage.saveCart(carrito)
				this.setItemValues(carrito)
				target.nextElementSibling.innerText = tempItem.cantidad
			}else if(target.classList.contains("decrease")){
				const id = parseInt(target.dataset.id, 10);
				let tempItem = carrito.find(item => item.id === id);
				tempItem.cantidad--;

				if(tempItem.cantidad > 0){
					Storage.saveCart(carrito);
					this.setItemValues(carrito);
					target.previousElementSibling.innerText = tempItem.cantidad;
				}else{
					this.removeItem(id);
					carritoCenter.removeChild(target.parentElement.parentElement)
				}
			}
		});
	}
	clearCarrito(){
		const cartItems = carrito.map(item => item.id)
		cartItems.forEach(id => this.removeItem(id))

		while(carritoCenter.children.length > 0){
			carritoCenter.removeChild(carritoCenter.children[0])
		}
	}
	removeItem(id){
		carrito = carrito.filter(item => item.id !== id);
		this.setItemValues(carrito)
		Storage.saveCart(carrito)
		let button = this.singleButton(id);
		if(button){
			button.disabled = false;
			button.innerText = "Añadir carrito"
		}
	}
	singleButton(id){
		return buttonDOM.find(button => parseInt(button.dataset.id) === id)
	}
}



class Storage {
	static saveProduct(obj){
		localStorage.setItem("productos", JSON.stringify(obj))
	}
	static saveCart(carrito){
		localStorage.setItem("carrito", JSON.stringify(carrito))
	}
	static getProductos(id){
		const producto = JSON.parse(localStorage.getItem("productos"))
		return producto.find(product =>product.id === parseFloat(id, 10))
	}
	static getCart(){
		return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];
	}
}

class Productos {
  async getProductos() {
    try {
			const result = await fetch("productos.json")
			const data = await result.json()
			const productos = data.items
			return productos
		}catch(err){
			console.log(err)
		}
  }
}

let category = "";
let productos  = [];

function categoryValue(){
	const ui = new UI();

	category = document.getElementById("category").value
	if(category.length > 0){
		const producto = productos.filter(regx => regx.category === category)
		ui.renderProductos(producto)
		ui.getButtons();
	}else{
		ui.renderProductos(productos)
		ui.getButtons();
	
	}
}

const query = new URLSearchParams(window.location.search)
let id = query.get('id')

document.addEventListener("DOMContentLoaded", async () =>{
	const productosLista = new Productos();
	const ui = new UI();

	ui.setAPP()

	productos = await productosLista.getProductos()
	if(id){
		ui.detalleProducto(id)
		Storage.saveProduct(productos)
		ui.getButtons();
		ui.cartLogic();
	}else{
		ui.renderProductos(productos)
		Storage.saveProduct(productos)
		ui.getButtons();
		ui.cartLogic();
	}
})

