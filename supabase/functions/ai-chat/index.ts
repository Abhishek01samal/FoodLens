import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, message, images, conversationHistory, productA, productB } = await req.json();
    
    const API_KEY = Deno.env.get("API_KEY");
   
    }

    let systemPrompt = "";
    let userPrompt = message;
    
    // Handle autocomplete mode
    if (mode === "autocomplete") {
      systemPrompt = `You are a food product autocomplete assistant. Given a partial product name, suggest 5-8 real food products including:
- Packaged foods (Indian brands like Maggi, Parle-G, Britannia, Amul, Haldiram's, and international brands)
- Fresh foods and ingredients (fruits, vegetables, grains, spices)
- Local cuisines from various countries (Indian dishes like biryani, dal, paneer butter masala, dosa, idli)
- Traditional and regional foods

Return ONLY a JSON object with suggestions array, nothing else. Format: {"suggestions": ["product1", "product2", ...]}

Examples:
Input: "mag" → {"suggestions": ["Maggi Noodles", "Maggi Masala", "Magnum Ice Cream", "Mango", "Maggi Soup"]}
Input: "par" → {"suggestions": ["Parle-G Biscuits", "Parle Monaco", "Paratha", "Parmesan Cheese", "Parsley"]}
Input: "dal" → {"suggestions": ["Dal Makhani", "Dal Tadka", "Moong Dal", "Toor Dal", "Masoor Dal"]}`;

      userPrompt = `Suggest products for: "${message}"`;
    } else if (mode === "comparison") {
      systemPrompt = `You are an expert nutritionist and food analyst with access to comprehensive food databases and web search capabilities. Compare two food products by researching current product information, nutrition facts, and ingredient lists.

Return ONLY valid JSON with this structure:
{
  "comparison": {
    "productA": "Product A Name",
    "productB": "Product B Name",
    "healthScoreA": number (0-100),
    "healthScoreB": number (0-100),
    "winner": "Product A" or "Product B",
    "categories": [
      {
        "name": "Calories",
        "importance": "critical",
        "productA": "value",
        "productB": "value",
        "winner": "A or B",
        "explanation": "why one is better"
      }
    ]
  }
}

Compare on these categories (mark importance as critical/medium/optional):
- Calories (total, per 100g, per serving)
- Macronutrients (protein, carbs, fat, fiber)
- Ingredients (quality, natural vs artificial, preservatives)
- Harmful Additives (MSG, TBHQ, BHT, BHA, artificial colors, palm oil)
- Health Score
- Allergens (dairy, gluten, nuts, soy, eggs)
- Sugar & Salt Levels
- Serving Size
- Price Comparison
- Vitamins & Minerals
- Shelf Life
- Processing Level
- Diet Compatibility
- Taste (rough estimate)
- Texture (rough estimate)
- Packaging Quality
- Brand Reputation

IMPORTANT: Research actual product data from the internet. Use web search to find:
- Current nutrition facts and ingredient lists
- Latest product formulations
- Price information from online retailers
- Customer reviews and ratings`;

      // Update user prompt to include product names
      if (productA && productB) {
        userPrompt = `Compare these two products with detailed web research: "${productA}" vs "${productB}". ${message || 'Provide comprehensive comparison based on real data.'}`;
      }
    } else if (mode === "product-info") {
      systemPrompt = `You are a comprehensive food product analyst with access to web search capabilities. Analyze the given product and provide COMPLETE information.

Return ONLY valid JSON with this structure:
{
  "productName": "string",
  "brand": "string",
  "category": "string (snack, fruit, dairy, beverage, grain, etc.)",
  "type": "veg/non-veg",
  "healthScore": number (0-100),
  "scoreCategory": "Very Unhealthy (0-20) | Poor (20-40) | Moderate (40-60) | Good (60-80) | Very Healthy (80-100)",
  "ingredients": {
    "all": ["list of all ingredients in descending order by weight"],
    "key": ["main components"],
    "additives": ["preservatives, colors, flavor enhancers"],
    "natural": ["natural ingredients"],
    "artificial": ["artificial ingredients"],
    "harmful": ["harmful ingredient - reason"],
    "allergens": ["allergen list"]
  },
  "nutrition": {
    "per100g": {
      "calories": number,
      "protein": number,
      "carbs": number,
      "sugar": number,
      "fiber": number,
      "fat": number,
      "saturatedFat": number,
      "transFat": number,
      "unsaturatedFat": number,
      "sodium": number,
      "cholesterol": number
    },
    "vitamins": ["Vitamin A, C, etc."],
    "minerals": ["Calcium, Iron, etc."]
  },
  "healthAssessment": {
    "isHealthy": "healthy/unhealthy",
    "processingLevel": "Ultra-processed/Processed/Minimally Processed/Natural",
    "diabeticFriendly": "yes/no/caution",
    "weightLoss": "suitable/not suitable",
    "muscleBuilding": "suitable/not suitable",
    "addedSugarLevel": "low/medium/high",
    "saltLevel": "low/medium/high",
    "oilQuality": "palm oil/refined oil/cold-pressed/etc."
  },
  "safety": {
    "certifications": ["FSSAI", "ISO", "Organic", etc.],
    "storageInstructions": "string",
    "contaminantRisks": "string",
    "spoilageSigns": "string"
  },
  "environmental": {
    "sustainable": "yes/no/partial",
    "packagingType": "recyclable/plastic/etc.",
    "carbonFootprint": "low/medium/high",
    "organic": "yes/no",
    "crueltyFree": "yes/no/unknown"
  },
  "cost": {
    "pricePerKg": "approx price",
    "valueForMoney": "excellent/good/average/poor",
    "healthierAlternatives": ["list of alternatives"],
    "cheaperSubstitutes": ["list"]
  },
  "taste": {
    "flavorProfile": "sweet/spicy/tangy/salty/etc.",
    "texture": "crunchy/creamy/soft/etc.",
    "howToConsume": "instructions",
    "bestCombinations": ["suggestions"],
    "portionRecommendation": "string"
  },
  "dietCompatibility": {
    "weightLoss": "suitable/not suitable - reason",
    "muscleGain": "suitable/not suitable - reason",
    "diabetic": "suitable/not suitable - reason",
    "heartHealth": "suitable/not suitable - reason",
    "highProtein": "suitable/not suitable - reason",
    "lowCarb": "suitable/not suitable - reason",
    "keto": "suitable/not suitable - reason",
    "glutenFree": "suitable/not suitable - reason",
    "indianMealPlanning": "suitable/not suitable - reason"
  },
  "ingredientExplainer": [
    {
      "name": "ingredient",
      "purpose": "why added",
      "healthImpact": "good/bad/neutral",
      "details": "explanation"
    }
  ],
  "redFlags": ["warning 1", "warning 2"],
  "companyInfo": {
    "companyName": "string",
    "foundedYear": "year",
    "headquarters": "location",
    "history": "brief history",
    "otherProducts": ["list of other products"],
    "revenue": "approx if known",
    "marketPosition": "leader/challenger/etc."
  }
}

IMPORTANT: Research actual product data from the internet including:
- Exact nutrition facts from official sources
- Complete ingredient lists
- Company information and history
- Price comparisons from retailers
- Customer reviews and ratings`;

      userPrompt = `Analyze this product completely: "${message}". Provide ALL details including nutrition, ingredients, health assessment, company history, and everything mentioned in the format.`;
    } else if (mode === "food-history") {
      systemPrompt = `You are a culinary historian and food expert with deep knowledge of food origins and cultural significance worldwide.

Return ONLY valid JSON with this structure:
{
  "dishName": "string",
  "origin": {
    "country": "string",
    "region": "string (city or region where first created)",
    "century": "string (century or year if known)"
  },
  "creator": {
    "who": "string (chef, king, community, dynasty, or nation)",
    "why": "string (purpose, need, event that led to creation)"
  },
  "story": "string (detailed historical story - incidents, royal stories, accidents, wars, migrations, cultural reasons, myths, legends)",
  "authenticIngredients": ["list of traditional ingredients used in earliest version"],
  "earlyRecipe": "description of what the earliest version looked like",
  "popularCities": ["list of Indian or international cities where the dish is most famous today"],
  "culturalSignificance": "string (how the dish is eaten today, why people love it)",
  "variations": ["list of regional variations with brief descriptions"],
  "funFacts": ["rare or surprising facts about the dish"],
  "modernAdaptations": "how the dish has evolved"
}

IMPORTANT: Research thoroughly and provide:
- Accurate historical information
- Authentic origin stories
- Cultural context
- Regional variations
- Interesting facts and legends`;

      userPrompt = `Give me a complete origin and history profile of the dish: "${message}". Include all details about origin, creator, story, ingredients, popular cities, cultural significance, variations, and fun facts.`;
    } else if (mode === "info") {
      systemPrompt = `You are a food analysis expert specializing in ingredient detection and health analysis.

Return ONLY valid JSON with this structure:
{
  "productName": "string",
  "healthScore": number (0-100),
  "scoreCategory": "Very Unhealthy (0-20) | Poor (20-40) | Moderate (40-60) | Good (60-80) | Very Healthy (80-100)",
  "ingredients": {
    "all": ["list of all ingredients"],
    "natural": ["natural ingredients with classification"],
    "artificial": ["artificial ingredients with classification"],
    "harmful": ["harmful ingredient - reason"],
    "preservatives": ["list"],
    "allergens": ["allergen list"]
  },
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number,
    "cholesterol": number
  },
  "ingredientExplainer": [
    {
      "name": "ingredient",
      "purpose": "why added",
      "healthImpact": "good/bad/neutral",
      "details": "explanation"
    }
  ],
  "redFlags": ["warning 1", "warning 2"],
  "dietCompatibility": {
    "weightLoss": "suitable/not suitable",
    "diabetic": "suitable/not suitable",
    "keto": "suitable/not suitable",
    "highProtein": "suitable/not suitable",
    "lowFat": "suitable/not suitable",
    "glutenFree": "suitable/not suitable"
  },
  "processingLevel": "Ultra Processed | Processed | Minimally Processed | Natural",
  "environmentalScore": number (0-100),
  "portionAdvice": "recommendation",
  "tastePrediction": "sweet/spicy/tangy/salty",
  "texturePrediction": "crunchy/creamy/soft"
}

Extract all ingredients from images, classify them, detect harmful additives, and provide comprehensive health analysis.`;
    } else if (mode === "diet") {
      systemPrompt = `You are an expert AI Diet Planner specializing in Indian diets and nutrition. Create a COMPLETE personalized diet plan based on the user's information.

ALWAYS return a valid JSON response with this structure:
{
  "type": "diet_plan",
  "calculations": {
    "bmr": number (calculated using Mifflin-St Jeor formula),
    "tdee": number (BMR * activity multiplier),
    "targetCalories": number (based on goal),
    "protein": number (grams per day),
    "carbs": number (grams per day),
    "fats": number (grams per day)
  },
  "meals": {
    "breakfast": ["item 1 with portions", "item 2 with portions"],
    "lunch": ["item 1 with portions", "item 2 with portions"],
    "dinner": ["item 1 with portions", "item 2 with portions"],
    "snacks": ["item 1", "item 2"]
  },
  "gymAddons": {
    "preWorkout": "specific food/drink recommendation",
    "postWorkout": "specific food/drink recommendation"
  },
  "advice": {
    "portionControl": "specific advice",
    "hydration": "water intake recommendation",
    "alternatives": ["healthy swap 1", "healthy swap 2"],
    "cheatMeal": "guideline for cheat meals"
  }
}

Activity Multipliers:
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extra Active: 1.9

Goal Adjustments:
- Weight Loss: TDEE - 500 calories
- Muscle Gain: TDEE + 300 calories
- Maintenance: TDEE

Macro Split:
- Weight Loss: 40% protein, 30% carbs, 30% fat
- Muscle Gain: 30% protein, 45% carbs, 25% fat
- Maintenance: 25% protein, 50% carbs, 25% fat

Create authentic Indian meal plans with specific portions. ALWAYS return valid JSON only.`;
    }

    // Build messages array
    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current message
    const currentMessage: any = {
      role: "user",
      content: []
    };

    if (userPrompt) {
      currentMessage.content.push({ type: "text", text: userPrompt });
    }

    if (images && images.length > 0) {
      for (const img of images) {
        currentMessage.content.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${img}` }
        });
      }
    }

    messages.push(currentMessage);

    console.log(`AI Chat - Mode: ${mode}, Message: ${userPrompt?.substring(0, 100)}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log(`AI Response received, length: ${content.length}`);
    
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let result;
    
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("JSON parse error:", e);
        // If JSON parsing fails, return raw content
        result = { type: "text", content: content };
      }
    } else {
      result = { type: "text", content: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
