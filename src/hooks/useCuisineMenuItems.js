import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const mapMenuItem = (item) => ({
  value: String(item.id),
  name: item.name || 'Untitled Dish',
  price: typeof item.price === 'number'
    ? `RM ${item.price.toFixed(2)}`
    : item.price || 'RM 0.00',
  description: item.description || '',
  tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : ['Chef Recommendation'],
  ingredients: Array.isArray(item.ingredients) ? item.ingredients : item.ingredients ? [item.ingredients] : [],
  image: item.image || 'https://via.placeholder.com/600x400?text=Menu+Image'
});

export const useCuisineMenuItems = (cuisineId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('menus')
          .select('*')
          .eq('cuisine_id', cuisineId)
          .eq('is_active', true)
          .order('id', { ascending: true });

        if (error) throw error;
        
        const mappedData = (data || []).map(mapMenuItem);
        
        // Merge strategy: Keep fallback items for a full UI if less than 6 items are in DB
        // We will fetch the fallback list from the component, but since we can't easily pass it,
        // we'll just return the mappedData and let the component handle the merge if it wants,
        // OR we can just pass mappedData and let the component fallback logic handle it.
        // Wait, the component currently completely ignores fallbacks if mappedData.length > 0.
        // Let's change the hook to return the raw mappedData, but we will edit the component instead!
        // Wait, I am replacing the hook file. I will just pass the mappedData.
        setItems(mappedData);
        setError('');
      } catch (err) {
        console.warn(`Failed to load cuisine ${cuisineId} menu:`, err.message || err);
        setItems([]);
        setError('Unable to load menu from Supabase. Showing curated preview.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [cuisineId]);

  return { items, loading, error };
};
