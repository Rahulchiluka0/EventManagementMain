import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Save, Trash2, Package, Tag, DollarSign, Loader2, Badge } from "lucide-react";
import { StallService, InventoryService } from "@/lib/api";

// Interface for product category
interface ProductCategory {
  id: number;
  name: string;
}

// Interface for product
interface Product {
  id?: string;
  stall_id?: string;
  category_id?: number;
  category?: string;
  category_name?: string;
  name: string;
  price: string;
  quantity: number;
  description: string;
  image_url?: string;
  // Category-specific fields
  size?: string;
  color?: string;
  ingredients?: string;
  allergens?: string;
  dietary?: string;
  material?: string;
  weight?: string;
  dimensions?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const StallInventoryManagement = () => {
  const { stallId } = useParams<{ stallId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stallDetails, setStallDetails] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // New product form state
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    category_id: undefined,
    price: "",
    quantity: 1,
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!stallId) return;

      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await InventoryService.getCategories();
        setCategories(categoriesResponse.data);

        // Fetch stall details
        const stallResponse = await StallService.getStallDetail(stallId);
        setStallDetails(stallResponse.data);

        // Fetch products
        const productsResponse = await InventoryService.getStallProducts(stallId);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stallId, toast]);

  const handleCategoryChange = (categoryId: string) => {
    setNewProduct({
      ...newProduct,
      category_id: parseInt(categoryId)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleAddProduct = async () => {
    // Validate form
    if (!newProduct.name || !newProduct.category_id || !newProduct.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Add product to backend
      const response = await InventoryService.addProduct(stallId!, newProduct);

      // Update local state with the new product
      setProducts([...products, response.data]);

      // Reset form
      setNewProduct({
        name: "",
        category_id: undefined,
        price: "",
        quantity: 1,
        description: ""
      });

      toast({
        title: "Product Added",
        description: "Product has been added to your inventory",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product to inventory",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveProduct = async (productId: string | undefined) => {
    if (!productId) return;

    try {
      setSaving(true);

      // Delete product from backend
      await InventoryService.deleteProduct(productId);

      // Update local state
      setProducts(products.filter(product => product.id !== productId));

      toast({
        title: "Product Removed",
        description: "Product has been removed from your inventory",
      });
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from inventory",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInventory = async () => {
    toast({
      title: "All Changes Saved",
      description: "Your inventory has been updated successfully",
    });
  };

  // Render category-specific fields
  const renderCategoryFields = () => {
    const category = categories.find(c => c.id === newProduct.category_id)?.name.toLowerCase();

    switch (category) {
      case "food":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                placeholder="List all ingredients"
                value={newProduct.ingredients || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens</Label>
              <Input
                id="allergens"
                name="allergens"
                placeholder="e.g., Nuts, Dairy, Gluten"
                value={newProduct.allergens || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "beverages":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                placeholder="List all ingredients"
                value={newProduct.ingredients || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Info</Label>
                <Input
                  id="dietary"
                  name="dietary"
                  placeholder="e.g., Vegan, Sugar-free"
                  value={newProduct.dietary || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens</Label>
                <Input
                  id="allergens"
                  name="allergens"
                  placeholder="e.g., Nuts, Dairy"
                  value={newProduct.allergens || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        );

      case "accessories":
      case "clothing":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  placeholder="e.g., Cotton, Silver"
                  value={newProduct.material || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="e.g., Red, Blue, Multi"
                  value={newProduct.color || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size/Dimensions</Label>
              <Input
                id="size"
                name="size"
                placeholder="e.g., S, M, L or dimensions"
                value={newProduct.size || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        );

      case "crafts":
      case "electronics":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                placeholder="e.g., 10cm x 15cm"
                value={newProduct.dimensions || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  placeholder="e.g., 250g"
                  value={newProduct.weight || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  placeholder="e.g., Wood, Plastic"
                  value={newProduct.material || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-500 text-sm">Loading stall details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-gray-600 hover:text-red-600 transition-colors p-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Stalls
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Inventory: {stallDetails?.name}</h1>
            <p className="text-gray-600">
              {stallDetails?.stallDetail.event_title} • {stallDetails?.stallDetail.location_in_venue}
            </p>
          </div>
          <Button
            onClick={handleSaveInventory}
            disabled={saving}
            className="mt-4 md:mt-0 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Inventory
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-gray-800">Add New Product</CardTitle>
            <CardDescription>
              Fill in the details to add a new product to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Product Category</Label>
                <Select
                  value={newProduct.category_id?.toString()}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                />
              </div>

              {/* Render dynamic fields based on category */}
              {newProduct.category_id && renderCategoryFields()}

              <Button
                type="button"
                onClick={handleAddProduct}
                disabled={saving}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Product Inventory List */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-gray-800">Current Inventory</CardTitle>
            <CardDescription>
              {products.length} {products.length === 1 ? 'product' : 'products'} in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg flex-shrink-0 bg-gray-50">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800">{product.name}</h3>
                          <Badge className="ml-3 bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
                            {product.category_name || categories.find(cat => cat.id === product.category_id)?.name || "Unknown"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span>Qty: {product.quantity}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1.5 text-gray-400" />
                            <span>${parseFloat(product.price).toFixed(2)}</span>
                          </div>
                          {product.material && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-1.5">Material:</span>
                              <span>{product.material}</span>
                            </div>
                          )}
                          {product.size && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-1.5">Size:</span>
                              <span>{product.size}</span>
                            </div>
                          )}
                          {product.ingredients && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-1.5">Ingredients:</span>
                              <span className="truncate max-w-[200px]">{product.ingredients}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0 space-x-3 md:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products in inventory</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Add products to your stall inventory using the form on the left.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StallInventoryManagement;