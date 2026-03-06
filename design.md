# FarmQ - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React SPA (Mobile-First)                            │  │
│  │  - Home Dashboard                                     │  │
│  │  - Disease Detection UI                              │  │
│  │  - Crop Recommendation Form                          │  │
│  │  - Voice Assistant Interface                         │  │
│  │  - Marketplace (Future)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    CDN & Load Balancer                       │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  CloudFront      │         │   ALB            │         │
│  │  (Static Assets) │         │   (API Traffic)  │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI Application (Docker Container)              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Disease   │  │   Crop     │  │ Fertilizer │    │  │
│  │  │  Detection │  │Recommender │  │   Advisor  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐                     │  │
│  │  │   Voice    │  │   Chat     │                     │  │
│  │  │  Assistant │  │  Streaming │                     │  │
│  │  └────────────┘  └────────────┘                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      AI/ML Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Amazon     │  │   Amazon     │  │   Local ML   │     │
│  │   Bedrock    │  │   Polly      │  │   Models     │     │
│  │  (Nova Lite) │  │  (Neural TTS)│  │  (PyTorch)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Architecture

#### Frontend Components
```
App.tsx
├── Home.tsx (Dashboard)
├── DiseaseDetection.tsx
│   ├── ImageUpload
│   ├── CameraCapture
│   └── ResultDisplay
├── CropRecommendation.tsx
│   ├── SoilParameterForm
│   └── RecommendationResults
├── VoiceAssistant.tsx
│   ├── VoiceInput
│   ├── ChatInterface
│   └── AudioPlayer
└── Marketplace.tsx (Future)
```

#### Backend Modules
```
app.py (FastAPI Application)
├── disease.py (Disease Detection Logic)
├── model.py (Crop Recommendation)
├── fertilizer.py (Fertilizer Recommendations)
└── routes/
    ├── /predict-disease
    ├── /recommend-crop
    ├── /recommend-fertilizer
    ├── /voice-query
    └── /chat-stream
```

## 2. Data Flow Diagrams

### 2.1 Disease Detection Flow
```
User → Upload Image → FastAPI → Preprocess Image → ResNet9 Model
                                                          ↓
User ← Display Results ← Format Response ← Classification Result
```

### 2.2 Voice Assistant Flow
```
User → Voice Input → Speech-to-Text → Amazon Bedrock (Nova Lite)
                                              ↓
User ← Audio Playback ← Amazon Polly ← Text Response (Streaming)
```

### 2.3 Crop Recommendation Flow
```
User → Input Soil Data → FastAPI → Validate Parameters → ML Models
                                                              ↓
User ← Display Recommendations ← Rank Results ← Model Predictions
```

## 3. API Design

### 3.1 REST Endpoints

#### Disease Detection
```http
POST /predict-disease
Content-Type: multipart/form-data

Request:
- file: image file (JPEG/PNG)

Response:
{
  "disease": "Tomato Late Blight",
  "confidence": 0.94,
  "treatment": "Apply copper-based fungicide...",
  "severity": "high"
}
```

#### Crop Recommendation
```http
POST /recommend-crop
Content-Type: application/json

Request:
{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}

Response:
{
  "recommendations": [
    {
      "crop": "Rice",
      "confidence": 0.89,
      "model": "RandomForest"
    },
    {
      "crop": "Cotton",
      "confidence": 0.76,
      "model": "XGBoost"
    }
  ]
}
```

#### Fertilizer Recommendation
```http
POST /recommend-fertilizer
Content-Type: application/json

Request:
{
  "nitrogen": 37,
  "phosphorus": 0,
  "potassium": 0,
  "crop": "Wheat"
}

Response:
{
  "fertilizer": "Urea",
  "quantity": "50 kg/acre",
  "application": "Apply in split doses...",
  "timing": "Before sowing and at tillering stage"
}
```

#### Voice Query
```http
POST /voice-query
Content-Type: application/json

Request:
{
  "query": "What is the best time to plant tomatoes?",
  "language": "en-US"
}

Response:
{
  "text": "The best time to plant tomatoes...",
  "audio_url": "https://...",
  "audio_base64": "data:audio/mp3;base64,..."
}
```

#### Chat Streaming
```http
POST /chat-stream
Content-Type: application/json

Request:
{
  "message": "How do I improve soil fertility?",
  "conversation_id": "uuid"
}

Response: (Server-Sent Events)
data: {"chunk": "To improve", "done": false}
data: {"chunk": " soil fertility", "done": false}
data: {"chunk": "...", "done": true}
```

### 3.2 Error Responses

```json
{
  "error": "Invalid image format",
  "code": "INVALID_FORMAT",
  "status": 400
}
```

## 4. Database Design

### 4.1 Current State (Stateless)
- No persistent database in MVP
- Session data stored in memory
- Uploaded images stored temporarily in `/uploads`

### 4.2 Future Schema (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    phone VARCHAR(15) UNIQUE,
    name VARCHAR(100),
    language VARCHAR(10),
    created_at TIMESTAMP
);

-- Disease Detections
CREATE TABLE disease_detections (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    image_url VARCHAR(255),
    disease VARCHAR(100),
    confidence FLOAT,
    detected_at TIMESTAMP
);

-- Crop Recommendations
CREATE TABLE crop_recommendations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    soil_params JSONB,
    recommended_crop VARCHAR(50),
    created_at TIMESTAMP
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    messages JSONB,
    created_at TIMESTAMP
);
```

## 5. Machine Learning Models

### 5.1 Disease Detection Model

**Architecture**: ResNet9 (Custom CNN)
```
Input (3x224x224) → Conv Block 1 → Conv Block 2 → Residual Block 1
→ Residual Block 2 → Classifier → Output (38 classes)
```

**Training Details**:
- Dataset: PlantVillage (custom subset)
- Classes: 38 plant diseases
- Input size: 224x224 RGB
- Preprocessing: Normalization, augmentation
- Framework: PyTorch

### 5.2 Crop Recommendation Models

**Models Used**:
1. Decision Tree Classifier
2. Random Forest Classifier
3. Support Vector Machine (SVM)
4. XGBoost Classifier
5. Naive Bayes Classifier

**Features**:
- Nitrogen (N), Phosphorus (P), Potassium (K)
- Temperature, Humidity, pH, Rainfall

**Output**: Crop name (22 classes)

### 5.3 Fertilizer Recommendation

**Approach**: Rule-based system with CSV lookup
- Input: N-P-K levels + Crop type
- Logic: Deficiency detection → Fertilizer mapping
- Output: Fertilizer type and application guidelines

## 6. UI/UX Design

### 6.1 Design Principles
- Mobile-first responsive design
- High contrast for outdoor visibility
- Large touch targets (min 44x44px)
- Minimal text input (voice-first)
- Progressive disclosure
- Offline-capable

### 6.2 Color Scheme
```css
Primary: #10b981 (Green - Agriculture)
Secondary: #3b82f6 (Blue - Trust)
Accent: #f59e0b (Amber - Warning/Alert)
Background: #ffffff / #1f2937 (Light/Dark)
Text: #111827 / #f9fafb (Light/Dark)
```

### 6.3 Typography
- Font Family: Inter (system fallback)
- Headings: 24-32px, Bold
- Body: 16-18px, Regular
- Captions: 14px, Medium

### 6.4 Key Screens

#### Home Dashboard
- Quick access cards for main features
- Recent activity summary
- Weather widget (future)
- Tips of the day

#### Disease Detection
- Camera/upload toggle
- Live preview
- Instant results with confidence
- Treatment recommendations
- Save to history

#### Voice Assistant
- Large microphone button
- Waveform visualization
- Text transcript
- Audio playback controls
- Conversation history

## 7. Security Design

### 7.1 Authentication (Future)
- Phone number + OTP
- JWT tokens for session management
- Refresh token rotation

### 7.2 API Security
- CORS configuration for allowed origins
- Rate limiting per IP/user
- Input validation and sanitization
- File upload restrictions (type, size)
- SQL injection prevention (parameterized queries)

### 7.3 AWS Security
- IAM roles with least privilege
- Secrets Manager for credentials
- VPC for backend isolation
- Security groups for network access
- CloudFront signed URLs for private content

### 7.4 Data Privacy
- No PII collection in MVP
- Image auto-deletion after processing
- HTTPS everywhere
- No third-party analytics

## 8. Performance Optimization

### 8.1 Frontend
- Code splitting by route
- Lazy loading for images
- Service worker for caching
- Debounced API calls
- Optimistic UI updates

### 8.2 Backend
- Async request handling (FastAPI)
- Model caching in memory
- Image preprocessing optimization
- Response compression (gzip)
- Connection pooling

### 8.3 Infrastructure
- CloudFront edge caching
- S3 static asset optimization
- EC2 auto-scaling groups
- ALB health checks
- Multi-region deployment (future)

## 9. Deployment Architecture

### 9.1 Frontend Deployment
```
Build → S3 Bucket → CloudFront Distribution → Custom Domain
```

### 9.2 Backend Deployment
```
Code → Docker Image → ECR → EC2 (Docker) → ALB → CloudFront
```

### 9.3 CI/CD Pipeline (Future)
```
GitHub → GitHub Actions → Build & Test → Deploy to Staging
→ Manual Approval → Deploy to Production
```

## 10. Monitoring & Logging

### 10.1 Application Logging
- Structured JSON logs
- Log levels: DEBUG, INFO, WARNING, ERROR
- Request/response logging
- Error stack traces

### 10.2 Metrics (Future)
- API response times
- Model inference latency
- Error rates
- User engagement metrics
- Resource utilization

### 10.3 Alerting (Future)
- High error rate alerts
- Service downtime notifications
- Resource threshold warnings

## 11. Testing Strategy

### 11.1 Unit Tests
- Model prediction functions
- Data validation logic
- Utility functions

### 11.2 Integration Tests
- API endpoint testing
- AWS service integration
- Database operations (future)

### 11.3 E2E Tests
- Critical user flows
- Cross-browser compatibility
- Mobile responsiveness

### 11.4 Performance Tests
- Load testing (100+ concurrent users)
- Stress testing
- Model inference benchmarks

## 12. Scalability Considerations

### 12.1 Horizontal Scaling
- Stateless backend design
- Load balancer distribution
- Auto-scaling based on CPU/memory

### 12.2 Vertical Scaling
- GPU instances for model inference
- Larger EC2 instances for traffic spikes

### 12.3 Caching Strategy
- CDN for static assets
- Redis for session data (future)
- Model result caching

### 12.4 Database Scaling (Future)
- Read replicas
- Connection pooling
- Query optimization
- Sharding by user region

## 13. Disaster Recovery

### 13.1 Backup Strategy
- S3 versioning for frontend
- ECR image retention
- Database backups (future)
- Model artifact backups

### 13.2 Recovery Plan
- Multi-AZ deployment
- Automated failover
- Blue-green deployments
- Rollback procedures

## 14. Accessibility

### 14.1 WCAG Compliance Goals
- Keyboard navigation
- Screen reader support
- Color contrast ratios (4.5:1)
- Alt text for images
- ARIA labels

### 14.2 Inclusive Design
- Voice-first for low literacy
- Simple language
- Visual feedback for actions
- Error prevention and recovery

## 15. Internationalization

### 15.1 Supported Languages (Future)
- English (en-US)
- Hindi (hi-IN)
- Regional languages (Marathi, Tamil, Telugu, etc.)

### 15.2 Implementation
- i18n library integration
- Language detection
- RTL support (future)
- Locale-specific formatting

## 16. Technical Debt & Future Improvements

- Implement user authentication
- Add comprehensive test coverage
- Set up CI/CD pipeline
- Implement real-time notifications
- Add offline-first capabilities
- Optimize model inference with TensorRT
- Implement GraphQL API
- Add WebSocket for real-time features
- Migrate to Kubernetes for orchestration
- Implement feature flags
