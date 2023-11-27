import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(categoryFrom => categoryFrom.id === product.categoryId); // find by product.categoryId

  const user = usersFromServer
    .find(userFrom => userFrom.id === category.ownerId); // find by category.ownerId

  return ({ product, category, user });
});
const getfilterBy = (arrayOfproducts,
  { sortByOwner, query, sortByCategory }) => {
  let coppyOfArray = [...arrayOfproducts];
  const lowQuery = query.trim().toLowerCase();

  if (sortByOwner) {
    coppyOfArray = coppyOfArray
      .filter(item => item.user.name === sortByOwner);
  }

  if (query) {
    coppyOfArray = coppyOfArray
      .filter(item => item.product.name.includes(lowQuery));
  }

  if (sortByCategory) {
    coppyOfArray = coppyOfArray
      .filter(item => item.category.title === sortByCategory);
  }

  return coppyOfArray;
};
// console.log(products);

export const App = () => {
  const [sortByOwner, setSortByOwner] = useState('');
  const [query, setQuery] = useState('');
  const [sortByCategory, setSortCategory] = useState('');
  const sortProducts = getfilterBy(products,
    { sortByOwner, query, sortByCategory });

  return (

    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': !sortByOwner })}
                onClick={() => setSortByOwner('')}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': user.name === sortByOwner })}
                  onClick={() => setSortByOwner(user.name)}
                >
                  {user.name}
                </a>
              ))}

            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}

                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSortCategory('')}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1',
                    { 'is-info':
                    sortByCategory === category.title })}
                  href="#/"
                  onClick={() => setSortCategory(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>

              { (sortProducts.map(sortProduct => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {sortProduct.product.id}
                  </td>

                  <td data-cy="ProductName">{sortProduct.product.name}</td>
                  <td data-cy="ProductCategory">{`${sortProduct.category.icon}-${sortProduct.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn({ 'has-text-link':
                    sortProduct.user.sex === 'm',
                    'has-text-danger':
                    sortProduct.user.sex === 'f' })}
                  >
                    {sortProduct.user.name}
                  </td>
                </tr>
              ))

              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
