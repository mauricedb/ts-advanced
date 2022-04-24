import 'bootstrap/dist/css/bootstrap.min.css';
import './css/site.css';
import { extraIngredientsSchema, pizzaArraySchema } from './schemas';
import { ExtraIngredients, ItemOrdered, Pizza, PizzaArray } from './types';

const formatCurrency = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
}).format;

const order: ItemOrdered[] = [];
const formToPizzaMap = new WeakMap<HTMLElement, Pizza>();
let extraIngredients: ExtraIngredients = {};

function addPizzaToOrder(e: SubmitEvent) {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const pizza = formToPizzaMap.get(form);

  if (!pizza) {
    throw new Error('Could not find pizza');
  }
  const formElements = Array.from(form.elements) as HTMLInputElement[];

  const extras = formElements
    .filter((element) => element.type === 'checkbox' && element.checked)
    .map((element) => element.value)
    .map((name) => {
      const extra = extraIngredients[name];
      return extra ?? { name, price: 0 };
    });

  const price = extras.reduce(
    (sum, extraIngredient) => sum + extraIngredient.price,
    pizza.price
  );

  const itemOrdered: ItemOrdered = {
    name: pizza.name,
    price,
    extras,
  };

  order.push(itemOrdered);

  itemOrdered.extras.forEach((extra) => {
    if (extra.price === 1) {
      // console.log(`${extra.name} has a price of € 1`);
    }
  });

  renderOrder();
}

function renderOrderTotal() {
  const totalPriceEl = document.getElementById('order-total');
  const totalPrice = order.reduce((sum, item) => sum + item.price, 0);
  totalPriceEl!.innerHTML = formatCurrency(totalPrice);
}

function renderOrder() {
  const orderEl = document.getElementById('order')!;
  orderEl.textContent = order.length ? '' : 'No items in the order yet';

  for (const pizza of order) {
    const article = document.createElement('li');
    article.classList.add('list-group-item');
    article.classList.add('d-flex');
    article.classList.add('justify-content-between');
    article.classList.add('align-items-start');

    const extraToppings =
      pizza.extras.map((extra) => `<li>${extra.name}</li>`).join('') ||
      '<li>No extras</li>';

    article.innerHTML = `
    <div class="ms-2 me-auto">
      <div class="fw-bold">${pizza.name}</div>
      <ul>${extraToppings}</ul>
    </div>
    <span class="badge bg-primary rounded-pill">${formatCurrency(
      pizza.price
    )}</span>
`;

    orderEl.appendChild(article);
  }

  renderOrderTotal();
}

function renderMenu(pizzas: PizzaArray, extras: ExtraIngredients) {
  extraIngredients = extras;

  const main = document.getElementById('menu');

  for (const pizza of pizzas) {
    const extraToppings = pizza.extras
      .map((key) => {
        const id = crypto.randomUUID();
        const extraTopping = extras[key] ?? { name: key, price: 0 };

        return `
<div class="form-check">
  <input
    class="form-check-input"
    type="checkbox"
    value="${key}"
    id="${id}"
  />
  <label class="form-check-label" for="${id}">
    ${extraTopping.name} (+${formatCurrency(extraTopping.price)})
  </label>
</div>`;
      })
      .join('');

    const pizzaForm = document.createElement('form');
    pizzaForm.classList.add('card', 'mb-3');
    pizzaForm.innerHTML = `
  <div class="row g-0">
    <div class="col-md-3">
      <img
        class="img-fluid rounded-start" 
        src="${pizza.imageUrl}"
        alt="${pizza.name}"
        title="${pizza.imageCredit}"
      />
    </div>
    <div class="col-md-9">
      <div class="card-body">
        <h5 class="card-title">${pizza.name}</h5>
        <h6 class="card-title float-end">${formatCurrency(pizza.price)}</h6>
        <h6 class="mt-5">Extra Toppings</h6>
        ${extraToppings}
        <button type="submit" class="btn btn-primary">Add</button>
      </div>
      
    </div>
  </div>`;

    formToPizzaMap.set(pizzaForm, pizza);

    main!.appendChild(pizzaForm);
  }
}

function checkout(amount: number, account: number) {
  document.getElementById('checkout-amount')!.innerText =
    formatCurrency(amount);
  document.getElementById('checkout-account')!.innerText =
    account.toLocaleString('nl-NL');
  (document.getElementById('checkout-dialog') as any)?.showModal();
}

async function loadPizzas(): Promise<PizzaArray> {
  const rsp = await fetch('/api/pizzas.json');
  const data = await rsp.json();
  return pizzaArraySchema.parse(data);
}
async function loadExtras(): Promise<ExtraIngredients> {
  const rsp = await fetch('/api/extra-ingredients.json');
  const data = await rsp.json();
  return extraIngredientsSchema.parse(data);
}

async function init() {
  try {
    renderOrder();
    const pizzasPromise = loadPizzas();
    const extrasPromise = loadExtras();
    renderMenu(await pizzasPromise, await extrasPromise);

    document
      .getElementById('checkout-button')
      ?.addEventListener('click', () => {
        const account = 1234567890;
        const amount = order.reduce((sum, item) => sum + item.price, 0);

        checkout(account, amount);
      });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `%cError loading data: ${error.name} - ${error.message}`,
        'font-weight: bold; font-size: 1.5rem;'
      );
    } else {
      console.error(error);
    }
  }
}

document.getElementById('menu')?.addEventListener('submit', addPizzaToOrder);

init();
