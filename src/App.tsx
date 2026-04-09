/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { Compare } from './pages/Compare';
import { Wishlist } from './pages/Wishlist';
import { Search } from './pages/Search';
import { About } from './pages/About';
import { Seller } from './pages/Seller';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="category/:slug" element={<Catalog />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="compare" element={<Compare />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
          <Route path="seller/:id" element={<Seller />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
