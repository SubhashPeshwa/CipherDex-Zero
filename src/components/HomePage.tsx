import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Brain, Database, Lightbulb, Zap, Coffee, BarChart, Shield, ChevronRight, Code } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CipherDex: Zero</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:text-gray-600 transition-colors">About</a></li>
              <li><a href="#features" className="hover:text-gray-600 transition-colors">Features</a></li>
              <li><a href="#missions" className="hover:text-gray-600 transition-colors">Missions</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-6">
              <h1 className="text-6xl font-extrabold leading-tight">
                Data Analysis<br />
                Meets Retro Gaming
              </h1>
              <p className="text-xl text-gray-600">
                CipherDex: Zero blends GBA-style graphics with modern data science. 
                Solve mysteries, uncover conspiracies, and become the ultimate digital detective.
              </p>
              <Button 
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full text-lg flex items-center space-x-2"
                onClick={() => window.location.href = "https://us-east-16hqc0onoe.auth.us-east-1.amazoncognito.com/login?client_id=600q6se0q7sc7ir9kou3ku41i0&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fgame"}
              >
                <span>Start Playing</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg filter blur-3xl opacity-30"></div>
              <img
                src="/assets/game1.png"
                alt="CipherDex: Zero Game Preview"
                className="relative z-10 rounded-lg shadow-2xl border-4 border-black"
              />
            </div>
          </section>

          <section id="about" className="mb-32">
            <h2 className="text-4xl font-bold text-center mb-16">The Future of Learning</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Brain, title: "AI-Powered Gameplay", description: "Use natural language to query data, powered by AWS Bedrock's AI capabilities." },
                { icon: Lightbulb, title: "Learn by Doing", description: "Gain real-world data analysis skills through engaging, narrative-driven gameplay." },
                { icon: Code, title: "Retro Meets Modern", description: "Experience GBA-style graphics powered by PixiJS, built on modern cloud architecture." }
              ].map((item, index) => (
                <Card key={index} className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="features" className="mb-32">
            <h2 className="text-4xl font-bold text-center mb-16">Core Mechanics</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Database, title: "Natural Language Queries", description: "Investigate data using conversational language, no SQL required." },
                { icon: Zap, title: "Instant Insight Recognition", description: "Experience 'aha!' moments as the game recognizes your discoveries in real-time." }
              ].map((item, index) => (
                <Card key={index} className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="missions" className="mb-32">
            <h2 className="text-4xl font-bold text-center mb-16">Mission Variety</h2>
            <Tabs defaultValue="beginner" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              {[
                { value: "beginner", icon: Coffee, title: '"Coffee Trail"', description: "Track down the office coffee thief using basic data correlation techniques." },
                { value: "intermediate", icon: BarChart, title: '"Operation: Market Mirage"', description: "Uncover potential insider trading by analyzing market data and internal communications." },
                { value: "advanced", icon: Shield, title: '"Ghost in the Machine"', description: "Detect and prevent a sophisticated cyber attack using real-time data pattern recognition." }
              ].map((mission, index) => (
                <TabsContent key={index} value={mission.value}>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <mission.icon className="w-6 h-6" />
                        <span>{mission.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{mission.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </main>

        <footer className="text-center text-gray-500 mt-16">
          <p>&copy; 2025 CipherDex: Zero. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
} 