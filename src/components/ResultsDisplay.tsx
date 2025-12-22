import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { Leaf, AlertTriangle, TrendingUp, ShoppingBag, Clock, DollarSign, Lightbulb, Factory, Package, ExternalLink, Building2, User, History, Calendar, Timer } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsDisplayProps {
  result: any;
}

export const ResultsDisplay = memo(({ result }: ResultsDisplayProps) => {
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (result.productDetails?.expiryDate) {
      const calculateDays = () => {
        const expiry = new Date(result.productDetails.expiryDate);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysUntilExpiry(diffDays);
      };
      
      calculateDays();
      const interval = setInterval(calculateDays, 86400000); // Update daily
      return () => clearInterval(interval);
    }
  }, [result.productDetails?.expiryDate]);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  }, []);

  const getProgressColor = useCallback((score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 60) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (score >= 40) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  }, []);

  const getScoreLabel = useCallback((score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Poor";
  }, []);

  const getExpiryColor = useCallback((days: number) => {
    if (days < 0) return "text-destructive";
    if (days <= 7) return "text-warning";
    if (days <= 30) return "text-accent";
    return "text-success";
  }, []);

  const resultsContent = (
    <div className="h-full overflow-y-auto space-y-6 p-4 md:p-8 bg-black md:rounded-2xl">

        <Card className="bg-black border-2 border-primary/20 p-6" id="overview">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              {result.productName}
            </h3>
          </motion.div>

          {/* Expiration Countdown Section */}
          {result.productDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 p-6 rounded-xl bg-gradient-to-br from-card/50 to-background border-2 border-primary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Timer className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-bold text-foreground">Product Freshness</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {result.productDetails.manufacturingDate && (
                  <div className="p-4 rounded-lg bg-card/30 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Manufactured</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{new Date(result.productDetails.manufacturingDate).toLocaleDateString()}</p>
                  </div>
                )}
                {result.productDetails.expiryDate && (
                  <div className="p-4 rounded-lg bg-card/30 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-destructive" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Expires On</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{new Date(result.productDetails.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-card/30 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Days Remaining</p>
                  </div>
                  <motion.p 
                    key={daysUntilExpiry}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={`text-3xl font-bold ${getExpiryColor(daysUntilExpiry)}`}
                  >
                    {daysUntilExpiry > 0 ? daysUntilExpiry : 'EXPIRED'}
                  </motion.p>
                </div>
              </div>
              {result.productDetails.shelfLife && (
                <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Expected Shelf Life:</span> {result.productDetails.shelfLife}
                  </p>
                  <Progress 
                    value={daysUntilExpiry > 0 ? Math.min((daysUntilExpiry / 365) * 100, 100) : 0} 
                    className="h-2 mt-3"
                  >
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" />
                  </Progress>
                </div>
              )}
            </motion.div>
          )}
          <div className="space-y-6" id="health">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground">Health Score</h4>
              </div>
              <div className="text-right">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`text-5xl font-bold ${getScoreColor(result.healthScore)}`}
                >
                  {result.healthScore}
                </motion.div>
                <Badge className="mt-2">{getScoreLabel(result.healthScore)}</Badge>
              </div>
            </motion.div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Health</span>
                <span className="font-semibold text-foreground">{result.healthScore}/100</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className={`h-full transition-all duration-500 ${getProgressColor(result.healthScore)}`}
                  style={{ width: `${result.healthScore}%` }}
                />
              </div>
            </div>
            {result.healthScoreBreakdown?.factors && (
              <div className="mt-6 space-y-3">
                {result.healthScoreBreakdown.factors.map((factor: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">{factor.factor}</span>
                      <Badge variant={factor.impact > 0 ? "default" : "destructive"}>
                        {factor.impact > 0 ? '+' : ''}{factor.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{factor.description}</p>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full transition-all duration-500 ${factor.impact > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                        style={{ width: `${Math.min(Math.abs(factor.impact), 100)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="glass p-6 border-2 border-primary/20" id="ingredients">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Ingredients Analysis</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold text-foreground text-lg">Harmful Ingredients</h4>
              </div>
              <div className="space-y-3">
                {result.ingredients.harmful.map((item: string, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive/50 backdrop-blur-sm hover:bg-destructive/15 transition-colors"
                  >
                    <p className="text-sm text-foreground leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-success" />
                <h4 className="font-semibold text-foreground text-lg">Beneficial Ingredients</h4>
              </div>
              <div className="space-y-3">
                {result.ingredients.beneficial.map((item: string, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-success/10 rounded-lg border-l-4 border-success/50 backdrop-blur-sm hover:bg-success/15 transition-colors"
                  >
                    <p className="text-sm text-foreground leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Card>

        {result.nutrition && (
          <Card className="bg-background border-2 border-primary/20 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Nutrition Facts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.nutrition).map(([key, value], i) => {
                const maxValues: any = {
                  calories: 2000,
                  protein: 50,
                  carbs: 300,
                  fat: 70,
                  fiber: 30,
                  sugar: 50,
                  sodium: 2300
                };
                const percentage = Math.min(((value as number) / (maxValues[key] || 100)) * 100, 100);
                return (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-card/30 rounded-lg border border-primary/20"
                  >
                  <div className="text-3xl font-bold text-primary mb-1">{value as number}</div>
                  <div className="text-xs text-muted-foreground capitalize mb-2">{key}</div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          i % 4 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          i % 4 === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          i % 4 === 2 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${percentage || 0}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        )}

        {result.vitamins && (
          <Card className="bg-background border-2 border-primary/20 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              Vitamins
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(result.vitamins).map(([key, value], i) => (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 bg-success/10 rounded-lg border border-success/30"
                >
                <div className="font-semibold text-foreground capitalize text-sm">{key.replace('vitamin', 'Vit. ')}</div>
                <div className="text-muted-foreground text-xs mt-1">{value as string}</div>
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted mt-2">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        i % 3 === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        i % 3 === 1 ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                        'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      style={{ width: `${(value as string)?.includes('%') ? parseInt((value as string).match(/\d+/)?.[0] || '0') : 0}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {result.minerals && (
          <Card className="bg-background border-2 border-primary/20 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Minerals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(result.minerals).map(([key, value], i) => (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 bg-accent/10 rounded-lg border border-accent/30"
                >
                <div className="font-semibold text-foreground capitalize text-sm">{key}</div>
                <div className="text-muted-foreground text-xs mt-1">{value as string}</div>
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted mt-2">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        i % 3 === 0 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                        i % 3 === 1 ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                        'bg-gradient-to-r from-amber-500 to-yellow-500'
                      }`}
                      style={{ width: `${(value as string)?.includes('%') ? parseInt((value as string).match(/\d+/)?.[0] || '0') : 0}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {result.productDetails && (
          <Card className="bg-background border-2 border-primary/20 p-6" id="details">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Product Details</h3>
            </div>
            <div className="space-y-4">
              {result.productDetails.manufacturer && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card/30 border border-primary/20"
                >
                  <Factory className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Manufacturer</p>
                    <p className="text-sm font-semibold text-foreground">{result.productDetails.manufacturer}</p>
                  </div>
                </motion.div>
              )}
              {result.productDetails.batchNumber && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card/30 border border-primary/20"
                >
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch Number</p>
                    <p className="text-sm font-semibold text-foreground">{result.productDetails.batchNumber}</p>
                  </div>
                </motion.div>
              )}
              {result.productDetails.certifications && result.productDetails.certifications.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-lg bg-card/30 border border-primary/20"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {result.productDetails.certifications.map((cert: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        )}

        {/* Company & Brand Information Section - Moved after Product Details */}
        {result.companyInfo && (
          <Card className="bg-background border-2 border-primary/30 p-6" id="company">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Brand & Company Insights</h3>
              </div>
              
              {result.companyInfo.companyName && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    <h4 className="text-lg font-semibold text-foreground">Company</h4>
                  </div>
                  <p className="text-foreground/90 leading-relaxed pl-7">{result.companyInfo.companyName}</p>
                </motion.div>
              )}

              {result.companyInfo.history && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-accent" />
                    <h4 className="text-lg font-semibold text-foreground">Company History</h4>
                  </div>
                  <p className="text-foreground/90 leading-relaxed pl-7">{result.companyInfo.history}</p>
                </motion.div>
              )}

              {result.companyInfo.founder && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    <h4 className="text-lg font-semibold text-foreground">Founder & Origin</h4>
                  </div>
                  <p className="text-foreground/90 leading-relaxed pl-7">{result.companyInfo.founder}</p>
                </motion.div>
              )}

              {result.companyInfo.marketPosition && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h4 className="text-lg font-semibold text-foreground">Market Position</h4>
                  </div>
                  <p className="text-foreground/90 leading-relaxed pl-7">{result.companyInfo.marketPosition}</p>
                </motion.div>
              )}

              {result.companyInfo.keyFacts && result.companyInfo.keyFacts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    <h4 className="text-lg font-semibold text-foreground">Key Facts</h4>
                  </div>
                  <div className="space-y-2 pl-7">
                    {result.companyInfo.keyFacts.map((fact: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-foreground/90 leading-relaxed">{fact}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        )}

        {result.homemadeAlternative && (
          <Card className="glass p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Homemade Alternative</h3>
            <h4 className="text-lg font-semibold text-primary mb-2">{result.homemadeAlternative.name}</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Prep: {result.homemadeAlternative.prepTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Cook: {result.homemadeAlternative.cookTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm">Servings: {result.homemadeAlternative.servings}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm">{result.homemadeAlternative.caloriesPerServing} cal/serving</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-foreground mb-2">Cost Breakdown</h5>
                <div className="grid md:grid-cols-3 gap-3 p-3 bg-card/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <p className="text-lg font-bold text-primary">{result.homemadeAlternative.totalCost || result.homemadeAlternative.costEstimate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Per Serving</p>
                    <p className="text-lg font-bold text-primary">{result.homemadeAlternative.perServingCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Savings</p>
                    <p className="text-lg font-bold text-success">{result.homemadeAlternative.savingsVsStoreBought}</p>
                  </div>
                </div>
                {result.homemadeAlternative.healthierBy && (
                  <p className="mt-2 text-sm text-success">✓ {result.homemadeAlternative.healthierBy} healthier</p>
                )}
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Ingredients</h5>
                <ul className="space-y-1">
                  {result.homemadeAlternative.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground">• {ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Instructions</h5>
                <ol className="space-y-2">
                  {result.homemadeAlternative.instructions.map((step: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground">{i + 1}. {step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
        )}

        {result.comparison && (
          <Card className="glass p-6" id="comparison">
            <h3 className="text-xl font-bold text-foreground mb-4">Smart Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Metric</th>
                    <th className="text-center p-2">{result.comparison.productA}</th>
                    <th className="text-center p-2">{result.comparison.productB}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-2 font-medium">Health Score</td>
                    <td className="text-center p-2">{result.comparison.healthScoreA}</td>
                    <td className="text-center p-2">{result.comparison.healthScoreB}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-medium">Calories</td>
                    <td className="text-center p-2">{result.comparison.caloriesA}</td>
                    <td className="text-center p-2">{result.comparison.caloriesB}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-medium">Sugar</td>
                    <td className="text-center p-2">{result.comparison.sugarA}g</td>
                    <td className="text-center p-2">{result.comparison.sugarB}g</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-medium">Protein</td>
                    <td className="text-center p-2">{result.comparison.proteinA}g</td>
                    <td className="text-center p-2">{result.comparison.proteinB}g</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2 font-medium">Quality</td>
                    <td className="text-center p-2 text-xs">{result.comparison.ingredientQualityA}</td>
                    <td className="text-center p-2 text-xs">{result.comparison.ingredientQualityB}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Cost</td>
                    <td className="text-center p-2">{result.comparison.costA}</td>
                    <td className="text-center p-2">{result.comparison.costB}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {result.productDetails && (
          <Card className="glass p-6" id="product-info">
            <div className="flex items-center gap-3 mb-4">
              <Factory className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Product Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {result.productDetails.manufacturer && (
                <div>
                  <span className="font-semibold text-foreground">Manufacturer:</span>
                  <p className="text-muted-foreground">{result.productDetails.manufacturer}</p>
                </div>
              )}
              {result.productDetails.batchNumber && (
                <div>
                  <span className="font-semibold text-foreground">Batch:</span>
                  <p className="text-muted-foreground">{result.productDetails.batchNumber}</p>
                </div>
              )}
              {result.productDetails.expiryDate && (
                <div>
                  <span className="font-semibold text-foreground">Expiry:</span>
                  <p className="text-muted-foreground">{result.productDetails.expiryDate}</p>
                </div>
              )}
              {result.productDetails.contact && (
                <div>
                  <span className="font-semibold text-foreground">Contact:</span>
                  <p className="text-muted-foreground">{result.productDetails.contact}</p>
                </div>
              )}
              {result.productDetails.certifications?.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-foreground">Certifications:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.productDetails.certifications.map((cert: string, i: number) => (
                      <Badge key={i} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {result.alternatives?.length > 0 && (
          <Card className="glass p-6" id="alternatives">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Healthy Alternatives & Purchase Links</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.alternatives.map((alt: any, i: number) => (
                <div key={i} className="p-4 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{alt.name}</h4>
                    <Badge>{alt.score}/100</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alt.whyBetter}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-primary">{alt.price}</span>
                    {alt.purchaseLink && (
                      <a 
                        href={alt.purchaseLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Buy Now <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {result.healthTip && (
          <Card className="glass p-6" id="tips">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-warning" />
              <h3 className="text-xl font-bold text-foreground">Daily Health Tip</h3>
            </div>
            <p className="text-muted-foreground">{result.healthTip}</p>
          </Card>
        )}
    </div>
  );

  if (isMobile) {
    return (
      <section id="results" className="min-h-screen py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold gradient-text mb-2">Analysis Results</h2>
        </motion.div>
        {resultsContent}
      </section>
    );
  }

  return (
    <section id="results" className="min-h-screen py-20 px-4 relative">
      <ContainerScroll
        titleComponent={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-2">Analysis Results</h2>
          </motion.div>
        }
      >
        {resultsContent}
      </ContainerScroll>
    </section>
  );
});

ResultsDisplay.displayName = "ResultsDisplay";
