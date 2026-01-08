import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to default 'postgres' database
        con = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            host='localhost',
            password='baddu'
        )
        
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'wound_db'")
        exists = cur.fetchone()
        
        if not exists:
            print("Creating database 'wound_db'...")
            cur.execute('CREATE DATABASE wound_db')
            print("Database created successfully!")
        else:
            print("Database 'wound_db' already exists.")
            
        cur.close()
        con.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    create_database()
