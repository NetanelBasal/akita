import { EntityStore } from '../src/api/entity-store';
import { persistState } from '../src/plugins/persist-state';
import { Store } from '../src/api/store';
import { StoreConfig } from '../src/api/store-config';

@StoreConfig({
  name: 'todos'
})
class TodosStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'products'
})
class ProductsStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'cart'
})
class CartStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'auth'
})
class AuthStore extends Store<any> {
  constructor() {
    super({});
  }
}

describe('persistState - Exclude', () => {
  const storage = persistState({
    exclude: ['cart', 'products']
  });

  afterAll(() => storage.destroy());

  const todos = new TodosStore();
  const products = new ProductsStore();
  const cart = new CartStore();
  const auth = new AuthStore();

  it('should start empty', () => {
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toBeNull();
  });

  it('should NOT save if in exclude', () => {
    products.add([{ id: 1 }]);
    cart.add([{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({});
  });

  it('should save if NOT in exclude', () => {
    todos.add([{ id: 1 }]);
    auth.setState(() => {
      return {
        id: 1,
        firstName: 'Netanel',
        lastName: 'Basal',
        token: 'token'
      };
    });
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({
      auth: { id: 1, firstName: 'Netanel', lastName: 'Basal', token: 'token' },
      todos: {
        entities: {
          '1': {
            id: 1
          }
        },
        error: null,
        ids: [1],
        loading: true
      }
    });
  });
});
