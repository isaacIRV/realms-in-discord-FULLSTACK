#!/bin/bash

# CONFIGURACIÓN
EC2_IP="98.95.11.209"
S3_BUCKET="s3-realmsindiscord-react-fullstack"
KEY_FILE="realms-key.pem"

echo "🚀 INICIANDO DESPLIEGUE COMPLETO A AWS..."
echo "📁 Usando key: $KEY_FILE"
echo "🌐 EC2: $EC2_IP"
echo "☁️ S3: $S3_BUCKET"

# Verificar que el archivo .pem existe
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ ERROR: No se encuentra el archivo $KEY_FILE"
    echo "   Asegúrate de que esté en la misma carpeta que este script"
    exit 1
fi

# 1. Build del frontend
echo ""
echo "1. 📦 Generando build de producción..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló el build de React"
    exit 1
fi

# 2. Subir frontend a S3
echo ""
echo "2. ☁️ Subiendo frontend a S3..."
aws s3 sync build/ s3://$S3_BUCKET/ --delete
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló la subida a S3"
    echo "   Verifica:"
    echo "   - Que tienes AWS CLI configurado"
    echo "   - Que el bucket $S3_BUCKET existe"
    exit 1
fi

# 3. Configurar EC2
echo ""
echo "3. 🔧 Configurando EC2..."
ssh -o StrictHostKeyChecking=no -i $KEY_FILE ec2-user@$EC2_IP 'bash -s' << 'EOF'
echo "🔄 Actualizando sistema..."
sudo yum update -y -q

echo "☕ Instalando Java 17..."
sudo amazon-linux-extras enable java-openjdk17 -y
sudo yum install java-17-openjdk-devel -y -q

echo "📁 Creando directorios..."
mkdir -p /home/ec2-user/apps
mkdir -p /home/ec2-user/logs

echo "🔥 Configurando firewall..."
if command -v firewall-cmd &> /dev/null; then
    sudo systemctl start firewalld
    sudo firewall-cmd --permanent --add-port=8080/tcp
    sudo firewall-cmd --permanent --add-port=8081/tcp
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --reload
else
    echo "⚠️  Firewalld no disponible, configurando iptables..."
    sudo yum install iptables-services -y -q
    sudo systemctl start iptables
    sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 8081 -j ACCEPT
    sudo iptables-save
fi

echo "✅ EC2 configurada"
EOF

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló la configuración de EC2"
    exit 1
fi

# 4. Subir backends a EC2
echo ""
echo "4. 📤 Subiendo microservicios a EC2..."
echo "Subiendo servicio de usuarios..."
scp -o StrictHostKeyChecking=no -i $KEY_FILE backend-usuarios/target/demo-0.0.1-SNAPSHOT.jar ec2-user@$EC2_IP:/home/ec2-user/apps/

echo "Subiendo servicio de mazos..."
scp -o StrictHostKeyChecking=no -i $KEY_FILE backend-mazos/target/deck-service-0.0.1-SNAPSHOT.jar ec2-user@$EC2_IP:/home/ec2-user/apps/

# 5. Iniciar servicios en EC2
echo ""
echo "5. 🚀 Iniciando servicios en EC2..."
ssh -o StrictHostKeyChecking=no -i $KEY_FILE ec2-user@$EC2_IP 'bash -s' << 'EOF'
cd /home/ec2-user/apps

echo "🛑 Deteniendo servicios previos..."
pkill -f "java.*jar" || true
sleep 3

echo "🔧 Configurando variables de entorno..."
# Asegurar que MongoDB Atlas esté configurado
export SPRING_DATA_MONGODB_URI="mongodb+srv://tcguser:tcg123@cluster0.lmpsw1x.mongodb.net/tcg_database?retryWrites=true&w=majority"

echo "🎯 Iniciando Microservicio de Usuarios (puerto 8080)..."
nohup java -jar demo-0.0.1-SNAPSHOT.jar --server.port=8080 > ../logs/users-service.log 2>&1 &
echo "PID Users: $!"

echo "🎯 Iniciando Microservicio de Mazos (puerto 8081)..."
nohup java -jar deck-service-0.0.1-SNAPSHOT.jar --server.port=8081 > ../logs/deck-service.log 2>&1 &
echo "PID Decks: $!"

echo "⏳ Esperando 20 segundos para que inicien los servicios..."
sleep 20

echo ""
echo "🔍 VERIFICANDO SERVICIOS..."
echo "=========================="

# Verificar Users Service
echo "📡 Probando Users Service..."
if curl -s -f http://localhost:8080 > /dev/null; then
    echo "✅ USERS SERVICE - FUNCIONANDO en puerto 8080"
else
    echo "❌ USERS SERVICE - NO RESPONDE"
    echo "📋 Últimas líneas del log:"
    tail -10 /home/ec2-user/logs/users-service.log
fi

# Verificar Deck Service
echo ""
echo "📡 Probando Deck Service..."
if curl -s -f http://localhost:8081 > /dev/null; then
    echo "✅ DECK SERVICE - FUNCIONANDO en puerto 8081"
else
    echo "❌ DECK SERVICE - NO RESPONDE"
    echo "📋 Últimas líneas del log:"
    tail -10 /home/ec2-user/logs/deck-service.log
fi

echo ""
echo "📊 LOGS DISPONIBLES EN:"
echo "   Users: /home/ec2-user/logs/users-service.log"
echo "   Decks: /home/ec2-user/logs/deck-service.log"

echo ""
echo "🔄 PARA REINICIAR SERVICIOS:"
echo "   pkill -f 'java.*jar' && cd /home/ec2-user/apps && nohup java -jar demo-0.0.1-SNAPSHOT.jar --server.port=8080 > ../logs/users-service.log 2>&1 &"
echo "   pkill -f 'java.*jar' && cd /home/ec2-user/apps && nohup java -jar deck-service-0.0.1-SNAPSHOT.jar --server.port=8081 > ../logs/deck-service.log 2>&1 &"
EOF

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló el inicio de servicios en EC2"
    exit 1
fi

echo ""
echo "🎉🎉🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE!"
echo "==========================================="
echo ""
echo "🌐 FRONTEND (S3):"
echo "   http://s3-realmsindiscord-react-fullstack.s3-website-us-east-1.amazonaws.com"
echo ""
echo "🔧 BACKEND (EC2):"
echo "   Users API: http://98.95.11.209:8080"
echo "   Decks API: http://98.95.11.209:8081"
echo ""
echo "📝 COMANDOS ÚTILES:"
echo "   Ver logs: ssh -i $KEY_FILE ec2-user@$EC2_IP 'tail -f /home/ec2-user/logs/*.log'"
echo "   Reiniciar: ssh -i $KEY_FILE ec2-user@$EC2_IP 'pkill -f \"java.*jar\" && cd /home/ec2-user/apps && nohup java -jar *.jar --server.port=8080 > ../logs/users-service.log 2>&1 & nohup java -jar *.jar --server.port=8081 > ../logs/deck-service.log 2>&1 &'"
echo ""
echo "🚀 ¡Tu aplicación está en producción!"